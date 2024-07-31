const nodemailer = require("nodemailer");

// Create a transporter using Gmail SMTP
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const EmailController = {
  sendConfirmation: async (req, res) => {
    const { name, email, bookingDetails } = req.body;

    const subject = "Booking Confirmation - Bukola Bliss Realtor";
    const text = `Dear ${name}, your booking with Bukola Bliss Realtor is confirmed. Details: ${JSON.stringify(
      bookingDetails
    )}`;
    const html = `
      <h1>Booking Confirmation</h1>
      <p>Dear ${name},</p>
      <p>Your booking with Bukola Bliss Realtor is confirmed. Here are your details:</p>
      <ul>
        <li>Date: ${new Date(bookingDetails.date).toLocaleDateString()}</li>
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

    try {
      await transporter.sendMail({
        from: '"Bukola Bliss Realtor" <alikismat2222@gmail.com>',
        to: email,
        subject: subject,
        text: text,
        html: html,
      });
      res.status(200).json({ message: "Confirmation email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({
        message: "Error sending confirmation email",
        error: error.message,
      });
    }
  },
};

module.exports = EmailController;
