export const getVerificationEmailTemplate = (name: string, token: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verification Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      line-height: 1.6;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
    }

    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }

    .content {
      padding: 40px 30px;
      text-align: center;
    }

    .greeting {
      font-size: 18px;
      color: #333333;
      margin-bottom: 20px;
    }

    .message {
      font-size: 16px;
      color: #666666;
      margin-bottom: 30px;
      line-height: 1.5;
    }

    .otp-container {
      background-color: #f8f9fa;
      border: 2px dashed #e9ecef;
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
    }

    .otp-label {
      font-size: 14px;
      color: #6c757d;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .otp-code {
      font-size: 36px;
      font-weight: bold;
      color: #495057;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
      background-color: #ffffff;
      padding: 15px 25px;
      border-radius: 8px;
      border: 1px solid #dee2e6;
      display: inline-block;
      margin: 10px 0;
    }

    .expiry-info {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 15px;
      margin: 25px 0;
      color: #856404;
      font-size: 14px;
    }

    .security-note {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 6px;
      padding: 15px;
      margin: 25px 0;
      color: #721c24;
      font-size: 14px;
    }

    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }

    .footer p {
      margin: 5px 0;
      font-size: 14px;
      color: #6c757d;
    }

    .company-name {
      font-weight: 600;
      color: #495057;
    }

    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }

      .content {
        padding: 30px 20px;
      }

      .otp-code {
        font-size: 28px;
        letter-spacing: 4px;
        padding: 12px 20px;
      }

      .header {
        padding: 30px 20px;
      }

      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>🔐 Account Verification</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">
        Hello! ${name},
      </div>

      <div class="message">
        We have received a request to verify your account.
        Please use the verification code below to complete the process:
      </div>

      <!-- OTP Container -->
      <div class="otp-container">
        <div class="otp-label">Verification Code</div>
        <div class="otp-code">${token}</div>
      </div>

      <!-- Expiry Info -->
      <div class="expiry-info">
        ⏰ <strong>Note:</strong> This code will expire in <strong>5 minutes</strong>.
      </div>

      <!-- Security Note -->
      <div class="security-note">
        🛡️ <strong>Security Notice:</strong> Do not share this code with anyone.
        If you did not request this code, please ignore this email.
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="company-name">Veil of Legend</p>
      <p>© 2025 Veil of Legend. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`; 