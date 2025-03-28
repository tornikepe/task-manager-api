// Import required modules
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./taskSchema");

/**
 * Define the schema for a User.
 * Each user has a name, email, password, age, authentication tokens, and an optional avatar.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is mandatory
      trim: true, // Removes leading and trailing spaces
    },
    email: {
      type: String,
      unique: true, // Email must be unique
      required: true,
      trim: true,
      lowercase: true, // Ensures email is stored in lowercase
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true, // Password is mandatory
      trim: true,
      minLength: 7, // Minimum password length
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain the word 'password'.");
        }
      },
    },
    age: {
      type: Number,
      min: 0, // Ensures age is not negative
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number.");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer, // Stores the user's profile picture as binary data
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Virtual relationship between User and Task.
 * This allows querying tasks associated with a user.
 */
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

/**
 * Removes sensitive user data before returning a response.
 * Hides the password, tokens, and avatar when sending user data.
 */
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

/**
 * Generates an authentication token for the user.
 * Uses JWT (JSON Web Token) for authentication.
 */
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

/**
 * Finds a user by email and password for login authentication.
 * If credentials are incorrect, an error is thrown.
 */
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login.");
  }

  return user;
};

/**
 * Hashes the user's password before saving it to the database.
 * Ensures passwords are stored securely.
 */
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

/**
 * Deletes all tasks associated with a user when the user is removed.
 */
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await Task.deleteMany({ owner: this._id });

    next();
  }
);

// Create a User model using the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
