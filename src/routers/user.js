// Import required modules
const express = require("express");
const User = require("../models/userSchema");
const auth = require("../middleware/auth");
const sharp = require("sharp");
const multer = require("multer");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");
const router = new express.Router();

/**
 * Create a new user.
 * Sends a welcome email upon registration.
 */
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * User login.
 * Returns an authentication token.
 */
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: "Invalid login credentials" });
  }
});

/**
 * User logout from the current session.
 */
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Logout from all sessions.
 */
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.json({ message: "Logged out from all sessions" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Get the authenticated user's profile.
 */
router.get("/users/me", auth, async (req, res) => {
  res.json(req.user);
});

/**
 * Update user profile.
 * Only allows updating 'name', 'email', and 'password'.
 */
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Delete user account.
 * Sends a cancellation email upon deletion.
 */
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne(); // Triggers pre("deleteOne") middleware
    sendCancelationEmail(req.user.email, req.user.name);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * File upload configuration for user avatar.
 */
const upload = multer({
  limits: {
    fileSize: 10000000, // Limit file size to 10MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image (JPG, JPEG, PNG)"));
    }
    cb(undefined, true);
  },
});

/**
 * Upload user avatar.
 * The image is resized and converted to PNG format.
 */
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();

      req.user.avatar = buffer;
      await req.user.save();
      res.json({ message: "Avatar uploaded successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  (error, req, res, next) => {
    res.status(400).json({ error: error.message });
  }
);

/**
 * Delete user avatar.
 */
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Fetch a user's avatar by user ID.
 */
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("Avatar not found");
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).json({ error: "User or avatar not found" });
  }
});

module.exports = router;
