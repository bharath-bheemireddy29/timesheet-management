import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import config from "../../config/config";
import logger from "../../config/logger";

const transport: Transporter = nodemailer.createTransport(config.email.smtp);

if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

/**
 * Send an email
 * @param to - Recipient email address
 * @param subject - Subject line of the email
 * @param text - Plain text body of the email
 * @returns A promise that resolves when the email is sent
 */
const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<void> => {
  const msg: SendMailOptions = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param to - Recipient email address
 * @param token - Password reset token
 * @returns A promise that resolves when the email is sent
 */
const sendResetPasswordEmail = async (
  to: string,
  token: string
): Promise<void> => {
  const subject = "Reset password";
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param to - Recipient email address
 * @param token - Email verification token
 * @returns A promise that resolves when the email is sent
 */
const sendVerificationEmail = async (
  to: string,
  token: string
): Promise<void> => {
  const subject = "Email Verification";
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

export { transport, sendEmail, sendResetPasswordEmail, sendVerificationEmail };
