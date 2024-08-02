// Import required modules from MailerSend
const { Recipient, EmailParams, MailerSend } = require("mailersend");

// Initialize MailerSend with API key from environment variables
const mailersend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

// Define the EmailController object
const EmailController = {
  // Method to send confirmation email
  sendConfirmation: async (req, res) => {
    // Extract data from request body
    const { name, email, bookingDetails } = req.body;

    // Set email subject
    const subject = "Booking Confirmation - Bukola Bliss Realtor";

    // Prepare plain text version of the email
    const text = `Dear ${name}, your booking with Bukola Bliss Realtor is confirmed. Details: ${JSON.stringify(
      bookingDetails
    )}`;

    // Prepare HTML version of the email
    const html = `
      <h1>Booking Confirmation</h1>
      <p>Dear ${name},</p>
      <p>Your booking with Bukola Bliss Realtor is confirmed. Here are your details:</p>
      <ul>
       <li>Date: ${new Date(bookingDetails.date).toLocaleString("en-US", {
         weekday: "long",
         day: "numeric",
         month: "long",
         year: "numeric",
       })}</li>
        <li>Start Time: ${new Date(
          bookingDetails.startTime
        ).toLocaleTimeString()}</li>
        <li>End Time: ${new Date(
          new Date(bookingDetails.endTime).getTime() + 15 * 60000
        ).toLocaleTimeString()}</li>
        <li>Duration: ${bookingDetails.duration} minutes</li>
      </ul>
      <p>Thank you for choosing Bukola Bliss Realtor. We look forward to serving you!</p>
      <p>Best regards,<br>Bukola Bliss Realtor Team</p>
      <p>Visit our website: <a href="https://bbr-client.netlify.app/">Bukola Bliss Realtor</a></p>
    `;

    // Set up recipient
    const recipients = [new Recipient(email, name)];

    // Configure email parameters
    const emailParams = new EmailParams()
      .setFrom({
        email: "bbrealtor@trial-3z0vkloo527l7qrx.mlsender.net",
        name: "Bukola Bliss Realtor",
      })
      .setReplyTo({
        email: "babian14@yahoo.co.uk",
        name: "Bukola Bliss Realtor",
      })
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(html)
      .setText(text);

    try {
      // Send the email
      await mailersend.email.send(emailParams);
      // Respond with success message
      res.status(200).json({ message: "Confirmation email sent successfully" });
    } catch (error) {
      // Log error and respond with error message
      console.error("Error sending email:", error);
      res.status(500).json({
        message: "Error sending confirmation email",
        error: error.message,
      });
    }
  },
};

// Export the EmailController
module.exports = EmailController;
