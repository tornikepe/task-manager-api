const sgMail = require("@sendgrid/mail");

// Setting up the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send a welcome email
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email, // Recipient's email
    from: "peitrishvilitornike2@gmail.com", // Sender's email
    subject: "Thanks for joining in!", // Email subject
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`, // Email body text
  });
};

// Function to send a cancellation email when a user deletes their account
const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email, // Recipient's email
    from: "peitrishvilitornike2@gmail.com", // Sender's email
    subject: "Sorry to see you go!", // Email subject
    text: `Goodbye, ${name}. I hope to see you back sometimes soon.`, // Email body text
  });
};

// Exporting both functions for use in other parts of the application
module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
