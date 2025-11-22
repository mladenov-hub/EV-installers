import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// The Promoter (DeepSeek-V3)
// Role: Outreach & Authority
// Task: Automate directory submissions and generate personalized outreach emails.

interface Directory {
    name: string;
    url: string;
    domainAuthority: number;
    status: 'pending' | 'submitted' | 'verified';
}

interface OutreachTarget {
    siteName: string;
    contactEmail: string;
    topic: string;
}

class Promoter {
    static directories: Directory[] = [
        { name: "Yelp", url: "yelp.com", domainAuthority: 94, status: 'pending' },
        { name: "YellowPages", url: "yellowpages.com", domainAuthority: 88, status: 'pending' },
        { name: "Angi", url: "angi.com", domainAuthority: 91, status: 'pending' },
        { name: "Thumbtack", url: "thumbtack.com", domainAuthority: 89, status: 'pending' }
    ];

    static async submitToDirectories(businessName: string) {
        console.log(`📣 Promoter (DeepSeek-V3): Initiating directory blast for "${businessName}"...`);

        for (const dir of this.directories) {
            console.log(`   > Submitting to ${dir.name} (DA: ${dir.domainAuthority})...`);
            // Simulate Puppeteer/Playwright automation delay
            await new Promise(resolve => setTimeout(resolve, 500));
            dir.status = 'submitted';
        }
        console.log("✅ Directory submissions complete.");
    }

    static generateOutreachEmail(target: OutreachTarget): string {
        // DeepSeek-V3 "Human-Like" Email Template
        return `
Subject: Quick question about ${target.siteName}

Hi Team,

I was reading your article on ${target.topic} and found it super helpful. 
I noticed you mentioned EV charging but didn't link to a local installer directory.

We actually just built a free database of verified installers. 
It might be a good resource for your readers who are looking for quotes.

Here it is: https://ev-installers-app.vercel.app

No pressure at all, just thought it would add value!

Best,
The Team
        `.trim();
    }

    static async sendEmail(target: OutreachTarget, emailContent: string) {
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if (!smtpUser || !smtpPass) {
            console.warn('⚠️  SMTP Credentials missing. Skipping actual email send.');
            console.log('   (Would have sent to:', target.contactEmail, ')');
            return;
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // use STARTTLS
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        try {
            console.log(`📧 Sending email to ${target.contactEmail}...`);
            const info = await transporter.sendMail({
                from: `"EV Installer Bot" <${smtpUser}>`,
                to: target.contactEmail,
                subject: `Quick question about ${target.siteName}`,
                text: emailContent,
            });
            console.log(`✅ Email sent: ${info.messageId}`);
        } catch (error) {
            console.error('❌ Failed to send email:', error);
        }
    }
}

// Simulation
if (require.main === module) {
    (async () => {
        // 1. Run Directory Submissions
        await Promoter.submitToDirectories("Austin EV Pros");

        // 2. Generate Outreach Email
        const target = {
            siteName: "Green Energy Blog",
            contactEmail: "editor@greenenergy.com", // Replace with real email for testing
            topic: "Home Charging Setup"
        };

        const email = Promoter.generateOutreachEmail(target);

        console.log("\n📝 Drafted Email:");
        console.log("-".repeat(40));
        console.log(email);
        console.log("-".repeat(40));

        // 3. Send Email (if creds exist)
        await Promoter.sendEmail(target, email);
    })();
}
