import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function sendTestEmail() {
    console.log('📧 Testing Email Configuration...');
    console.log(`Host: ${process.env.SMTP_HOST}`);
    console.log(`User: ${process.env.SMTP_USER}`);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        const info = await transporter.sendMail({
            from: `"The Promoter" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Sending to yourself to verify
            subject: "🚀 Test from EV Installer Swarm",
            text: "This is a test email from your AI Swarm. If you are reading this, the Promoter is ready to launch outreach campaigns.",
            html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>🚀 System Status: ONLINE</h2>
          <p>This is a verification email from <strong>The Promoter</strong>.</p>
          <p><strong>Configuration Check:</strong></p>
          <ul>
            <li>SMTP Connection: ✅ Success</li>
            <li>Authentication: ✅ Success</li>
            <li>Delivery: ✅ Success</li>
          </ul>
          <p>We are ready to start contacting installers and directories.</p>
          <br>
          <p><em>- The Passive Income Swarm</em></p>
        </div>
      `,
        });

        console.log('✅ Message sent: %s', info.messageId);
        console.log('Check your inbox at: ' + process.env.SMTP_USER);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
}

sendTestEmail();
