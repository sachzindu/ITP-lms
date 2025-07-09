import { transporter } from "./emailConfig.js";
import { generateOTP } from "./otpHelper.js"; // Helper function to generate OTP
import {
    Verification_Email_Template,
    Welcome_Email_Template
} from "./emailTemplateVerification.js";

// Database simulation (temporary)
let otpDatabase = {}; // Holds the OTPs temporarily for simplicity
let userDatabase = {}; // Simulating a user database for this example

// Send verification code via email
export const SendVerificationCode = async (email, verificationCode) => {
    try {
        if (!process.env.SMTP_FROM_EMAIL) {
            throw new Error("SMTP_FROM_EMAIL environment variable is not set.");
        }

        const htmlContent = Verification_Email_Template
            .replace("{verificationCode}", verificationCode)
            .replace("{expiryMinutes}", "10");

        const mailOptions = {
            from: `"IgniteLearn 👻" <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: "Verify Your Email",
            text: `Your verification code is ${verificationCode}. It will expire in 10 minutes.`,
            html: htmlContent,
        };

        const response = await transporter.sendMail(mailOptions);
        console.log(`Verification Email Sent Successfully to ${email}:`, response.messageId);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error("Verification Email Error for", email, error);
        throw new Error(`Failed to send verification email to ${email}: ${error.message}`);
    }
};

// Send welcome email
export const SendWelcomeEmail = async (email, username) => {
    try {
        if (!process.env.SMTP_FROM_EMAIL) {
            throw new Error("SMTP_FROM_EMAIL environment variable is not set.");
        }

        const htmlContent = Welcome_Email_Template.replace("{name}", username);

        const mailOptions = {
            from: `"IgniteLearn 👻" <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: `Welcome to IgniteLearn, ${username}!`,
            text: `Hello ${username}, welcome to IgniteLearn! Enjoy your studies with us.`,
            html: htmlContent,
        };

        const response = await transporter.sendMail(mailOptions);
        console.log(`Welcome Email Sent Successfully to ${email}:`, response.messageId);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error("Welcome Email Error for", email, error);
        throw new Error(`Failed to send welcome email to ${email}: ${error.message}`);
    }
};

export const PasswordVerificationCode = async (email, verificationCode) => {
    try {
        if (!process.env.SMTP_FROM_EMAIL) {
            throw new Error("SMTP_FROM_EMAIL environment variable is not set.");
        }

        const htmlContent = Verification_Email_Template
            .replace("{verificationCode}", verificationCode)
            .replace("{expiryMinutes}", "10");

        const mailOptions = {
            from: `"IgniteLearn 👻" <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: "Recover Your Password",
            text: `Your verification code is ${verificationCode}. It will expire in 10 minutes.`,
            html: htmlContent,
        };

        const response = await transporter.sendMail(mailOptions);
        console.log(`Password Recovery OTP Sent Successfully to ${email}:`, response.messageId);
        return { success: true, messageId: response.messageId };
    } catch (error) {
        console.error("Password Recovery OTP Error for", email, error);
        throw new Error(`Failed to Send Password Recovery OTP to ${email}: ${error.message}`);
    }
};
