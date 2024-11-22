const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (toEmail, userName) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: 'mail.privateemail.com', // SMTP Host
            port: 465, // SSL Port
            secure: true, // Use SSL
            auth: {
                user: 'hello@pawprint.care', // Your email
                pass: process.env.WELCOME_EMAIL_PASSWORD,
            },
        });

        // Email content
        const mailOptions = {
            from: '"PawPrint" <hello@pawprint.care>', // Sender address
            to: toEmail, // Recipient
            subject: 'Welcome to PawPrint!', // Subject line
            text: `Hi ${userName},\n\n
                Welcome to PawPrint! We're excited to have you onboard!\n\n
                We would love to hear from you, so if you have any questions or would like to provide any feedback, please do reach out to us at support@pawprint.care.\n\n
                Best regards,\nThe PawPrint Team
            `,  // Plain text body
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                    <p>Hi ${userName},</p>
                    <p>Welcome to <b style="color:orange;">PawPrint</b>! We're excited to have you onboard!</p>
                    <p>We would love to hear from you, so if you have any questions or would like to provide any feedback, please do reach out to us at <a href="mailto:support@pawprint.care" style="color:orange;">support@pawprint.care</a>.</p>
                    <p>Best regards,<br><b>The PawPrint Team</b></p>
                </div>
            `,  // HTML body
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent to:', toEmail);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error;
    }
};

module.exports = { sendWelcomeEmail };
