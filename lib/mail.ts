import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT ?? 587),
  secure: (SMTP_SECURE ?? "false") === "true",
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

function wrapHtml(title: string, subtitle: string, body: string, buttonUrl?: string, buttonText?: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
        }

        .wrapper {
          background-color: #f8f9fa;
          padding: 20px;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          overflow: hidden;
        }

        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }

        .logo {
          max-width: 140px;
          height: auto;
          margin-bottom: 20px;
        }

        .header-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .header-subtitle {
          font-size: 14px;
          opacity: 0.9;
          font-weight: 400;
        }

        .content {
          padding: 40px 30px;
        }

        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .message {
          font-size: 14px;
          line-height: 1.8;
          color: #555;
          margin-bottom: 20px;
        }

        .message p {
          margin-bottom: 12px;
        }

        .highlight {
          font-weight: 600;
          color: #667eea;
        }

        .code-box {
          background-color: #f5f7ff;
          border: 2px solid #667eea;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          margin: 24px 0;
        }

        .code {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #667eea;
          font-family: 'Courier New', monospace;
        }

        .code-expiry {
          font-size: 12px;
          color: #999;
          margin-top: 12px;
        }

        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          margin-top: 20px;
          transition: transform 0.2s;
          border: none;
          cursor: pointer;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .warning-box {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 16px;
          border-radius: 4px;
          margin-top: 20px;
          font-size: 13px;
          color: #856404;
        }

        .footer {
          background-color: #f8f9fa;
          border-top: 1px solid #e9ecef;
          padding: 30px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }

        .footer-links {
          margin-bottom: 15px;
        }

        .footer-links a {
          color: #667eea;
          text-decoration: none;
          margin: 0 10px;
          font-size: 12px;
        }

        .footer-links a:hover {
          text-decoration: underline;
        }

        .divider {
          height: 1px;
          background-color: #e9ecef;
          margin: 20px 0;
        }

        .social-links {
          margin-top: 15px;
        }

        .social-links a {
          display: inline-block;
          width: 32px;
          height: 32px;
          background-color: #e9ecef;
          border-radius: 50%;
          text-align: center;
          line-height: 32px;
          margin: 0 5px;
          color: #667eea;
          text-decoration: none;
          font-weight: bold;
        }

        .footer-copyright {
          margin-top: 15px;
          color: #bbb;
        }

        @media (max-width: 600px) {
          .container {
            border-radius: 0;
          }

          .header {
            padding: 30px 15px;
          }

          .header-title {
            font-size: 24px;
          }

          .content {
            padding: 25px 15px;
          }

          .code {
            font-size: 24px;
          }

          .cta-button {
            display: block;
            text-align: center;
            width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <!-- Header -->
          <div class="header">
            <img src="https://example.com/logo.png" alt="Financi Logo" class="logo" style="max-width: 120px;">
            <div class="header-title">${title}</div>
            <div class="header-subtitle">${subtitle}</div>
          </div>

          <!-- Content -->
          <div class="content">
            ${body}
            ${buttonUrl && buttonText ? `<a href="${buttonUrl}" class="cta-button">${buttonText}</a>` : ''}
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-links">
              <a href="https://financi.com">Home</a>
              <a href="https://financi.com/privacy">Privacy Policy</a>
              <a href="https://financi.com/terms">Terms of Service</a>
              <a href="https://financi.com/contact">Contact Us</a>
            </div>
            <div class="divider"></div>
            <div class="social-links">
              <a href="https://facebook.com/financi" title="Facebook">f</a>
              <a href="https://twitter.com/financi" title="Twitter">𝕏</a>
              <a href="https://instagram.com/financi" title="Instagram">📷</a>
              <a href="https://linkedin.com/company/financi" title="LinkedIn">in</a>
            </div>
            <div class="footer-copyright">
              <p>© ${new Date().getFullYear()} Financi. All rights reserved.</p>
              <p style="margin-top: 8px;">Secure • Reliable • Professional Financial Management</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendOtpMail(to: string, otp: string) {
  const from = process.env.SMTP_FROM || "no-reply@financi.com";
  const body = `
    <p class="greeting">Password Reset Request</p>
    <div class="message">
      <p>Hi there,</p>
      <p>We received a request to reset your password. Your one-time verification code is:</p>
    </div>
    <div class="code-box">
      <div class="code">${otp}</div>
      <div class="code-expiry">Expires in ${process.env.RESET_TOKEN_TTL_MIN ?? 15} minutes</div>
    </div>
    <div class="message">
      <p>Use this code to complete your password reset process. <span class="highlight">Do not share this code with anyone.</span></p>
      <p style="color: #999; font-size: 12px;">If you didn't request this reset, please ignore this email or contact support if you have concerns about your account security.</p>
    </div>
    <div class="warning-box">
      ⚠️ <strong>Security Alert:</strong> Never share your verification code with anyone, including Financi staff.
    </div>
  `;

  await transporter.sendMail({
    to,
    from,
    subject: "🔐 Your Password Reset Code - " + otp,
    html: wrapHtml("Password Reset", "Secure Your Account", body),
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  const from = process.env.SMTP_FROM || "no-reply@financi.com";
  const body = `
    <p class="greeting">Welcome to Financi, ${name}! 🎉</p>
    <div class="message">
      <p>Your account has been successfully created and is ready to use.</p>
      <p>Financi is your trusted partner for comprehensive financial management. With our platform, you can:</p>
      <ul style="margin: 12px 0 12px 20px; color: #555;">
        <li>Track all your income and expenses in real-time</li>
        <li>Manage savings goals and investments</li>
        <li>Monitor loans and borrowed amounts</li>
        <li>Get insights with detailed reports and analytics</li>
      </ul>
      <p><span class="highlight">Get started now</span> by logging in and setting up your first category.</p>
    </div>
    <div style="background-color: #f0f4ff; padding: 16px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600; color: #667eea;">💡 Quick Tip:</p>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #555;">Start by creating expense categories to better organize your finances.</p>
    </div>
  `;

  await transporter.sendMail({
    to,
    from,
    subject: "🎉 Welcome to Financi - Your Financial Management Journey Starts Now!",
    html: wrapHtml("Welcome Aboard", "Start Managing Your Finances Today", body),
  });
}

export async function sendLoginAlertEmail(to: string, name: string, time: string) {
  const from = process.env.SMTP_FROM || "no-reply@financi.com";
  const body = `
    <p class="greeting">New Login Detected</p>
    <div class="message">
      <p>Hi <span class="highlight">${name}</span>,</p>
      <p>We noticed a new login to your Financi account.</p>
    </div>
    <div style="background-color: #f5f7ff; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
      <p style="margin: 0; font-size: 13px; color: #666;"><strong>Login Details:</strong></p>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #333;"><strong>Time:</strong> ${time}</p>
    </div>
    <div class="message">
      <p style="color: #666; font-size: 13px;">✓ <strong>If this was you:</strong> No action is needed. You can safely ignore this email.</p>
      <p style="color: #d32f2f; font-size: 13px;">✗ <strong>If this wasn't you:</strong> Your account may be compromised. Please reset your password immediately and enable two-factor authentication for extra security.</p>
    </div>
    <div class="warning-box">
      🔒 For your security, never share your password or login credentials with anyone.
    </div>
  `;

  await transporter.sendMail({
    to,
    from,
    subject: "🔔 Security Alert: New Login to Your Financi Account",
    html: wrapHtml("Login Alert", "Account Security Notice", body),
  });
}

