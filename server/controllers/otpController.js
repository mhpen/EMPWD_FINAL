import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import { User } from '../models/userModel.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Add verification
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP verification error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

// Generate OTP function
const generateNumericOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Update the email HTML template in both sendOTP and resendOTP functions
const createEmailTemplate = (otp) => `
  <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <!-- Logo -->
       <div style="text-align: center; margin-bottom: 30px;">
        <a href="https://imgbb.com/"><img src="https://i.ibb.co/Q9jtX3D/Group-1-1-1.png" alt="" border="0"></a>         
      <!-- Greeting -->
      <h2 style="color: #333; text-align: center; margin-bottom: 20px; font-size: 24px;">
        Verify Your Email Address
      </h2>
      
      <!-- Message -->
      <p style="color: #666; text-align: center; margin-bottom: 30px; font-size: 16px; line-height: 1.5;">
        Thank you for choosing <b>EmpowerPWD</b>. To complete your registration, please use the verification code below:
      </p>
      
      <!-- OTP Code -->
      <div style="background-color: #f8f8f8; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 36px; letter-spacing: 8px; color: #000; margin: 0; font-weight: bold;">
          ${otp}
        </h1>
      </div>
      
      <!-- Timer Warning -->
      <p style="color: #666; text-align: center; margin-bottom: 30px; font-size: 14px;">
        This code will expire in <span style="color: #ff0000; font-weight: bold;">5 minutes</span>.
      </p>
      
      <!-- Additional Info -->
      <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
        <p style="color: #999; font-size: 12px; text-align: center; line-height: 1.5;">
          If you didn't request this verification code, please ignore this email or contact our support team if you have concerns.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} EmpowerPWD. All rights reserved.
        </p>
        <div style="margin-top: 10px;">
          <a href="#" style="color: #666; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
          <a href="#" style="color: #666; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
        </div>
      </div>
    </div>
  </div>
`;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update the sendOTP function
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateNumericOTP();

    await User.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
        isEmailVerified: false
      },
      { upsert: true }
    );

    // Send email with updated template
    const mailOptions = {
      from: {
        name: 'EmpowerPWD',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Verify Your Email - EmpowerPWD',
      html: createEmailTemplate(otp)
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
};

// Update the resendOTP function similarly
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user exists and last OTP was sent more than 1 minute ago
    const user = await User.findOne({ email });
    if (user && user.otpExpiry) {
      const timeSinceLastOTP = Date.now() - new Date(user.otpExpiry).getTime() + (5 * 60 * 1000);
      const oneMinuteInMs = 60 * 1000;
      
      if (timeSinceLastOTP < oneMinuteInMs) {
        return res.status(429).json({
          success: false,
          message: 'Please wait 1 minute before requesting a new OTP'
        });
      }
    }

    // Generate new OTP
    const otp = generateNumericOTP();

    // Update user with new OTP
    await User.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
      }
    );

    // Send email with updated template
    const mailOptions = {
        from: {
            name: 'EmpowerPWD',
            address: process.env.EMAIL_USER
          },
          to: email,
          subject: 'Verify Your Email - EmpowerPWD',
          html: createEmailTemplate(otp)
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'New OTP sent successfully'
    });

  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark email as verified and clear OTP
    await User.findOneAndUpdate(
      { email },
      {
        isEmailVerified: true,
        $unset: { otp: 1, otpExpiry: 1 }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
}; 