const nodemailer = require('nodemailer');

// Configure nodemailer with Gmail (using app password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'awasthr080@gmail.com',
    pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD
  }
});

// Send contact form email
const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, subject, message, recipientEmail } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER || 'awasthr080@gmail.com',
      to: recipientEmail || 'awasthr080@gmail.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="margin: 20px 0;">
              <p><strong style="color: #555;">Name:</strong> ${name}</p>
              <p><strong style="color: #555;">Email:</strong> ${email}</p>
              <p><strong style="color: #555;">Phone:</strong> ${phone}</p>
              <p><strong style="color: #555;">Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #ec4899; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="color: #666; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
              <p>This is an automated message from the Awasthi Beauty & Cosmetics website contact form.</p>
            </div>
          </div>
        </div>
      `
    };

    // Email to user (confirmation)
    const userMailOptions = {
      from: process.env.EMAIL_USER || 'awasthr080@gmail.com',
      to: email,
      subject: 'We Received Your Message - Awasthi Beauty & Cosmetics',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #ec4899;">Thank You for Contacting Us!</h2>
            
            <p style="color: #666; font-size: 16px;">
              Hi <strong>${name}</strong>,
            </p>
            
            <p style="color: #666; font-size: 16px;">
              We have received your message and appreciate you reaching out to Awasthi Beauty & Cosmetics. 
              Our team will review your inquiry and get back to you as soon as possible.
            </p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #ec4899; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your Message Details:</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Contact Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
            </div>
            
            <p style="color: #666; font-size: 16px;">
              In the meantime, feel free to visit our store or shop our products on Meesho!
            </p>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; margin: 5px 0;">
                <strong>Awasthi Beauty & Cosmetics</strong><br>
                Phone: +91 9305748046<br>
                Email: awasthr080@gmail.com
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully!'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message. Please try again later.',
      error: error.message
    });
  }
};

module.exports = { sendContactEmail };
