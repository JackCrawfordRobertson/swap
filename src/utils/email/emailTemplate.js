// src/utils/email/emailTemplate.js

/**
 * Generates an HTML email template for user registration confirmation.
 * @param {Object} options - Options for email content.
 * @param {string} options.content - Main content of the email.
 * @param {string} [options.footerText] - Optional footer text.
 * @returns {string} HTML email template.
 */
export const createUserRegistrationTemplate = ({ content, footerText }) => `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h2 style="color: #4A90E2; font-size: 24px; margin: 0;">SWAP Registration</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; font-size: 16px; line-height: 1.6; color: #333; text-align: center;">
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center; color: #777; font-size: 12px;">
                  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                  ${footerText || 'Thank you for using SWAP! For assistance, please contact support at <a href="mailto:support@ice-hub.biz" style="color: #4A90E2; text-decoration: none;">support@ice-hub.biz</a>'}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

/**
 * Generates an HTML email template for admin approval requests.
 * @param {Object} options - Options for email content and links.
 * @param {string} options.content - Main content of the email.
 * @param {string} options.approvalLink - Approval link for admins.
 * @param {string} options.disapprovalLink - Disapproval link for admins.
 * @param {string} [options.footerText] - Optional footer text.
 * @returns {string} HTML email template.
 */
export const createAdminApprovalTemplate = ({ content, approvalLink, disapprovalLink, footerText }) => `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h2 style="color: #4A90E2; font-size: 24px; margin: 0;">SWAP Registration</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; font-size: 16px; line-height: 1.6; color: #333; text-align: center;">
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="text-align: center; padding: 20px;">
                  <a href="${approvalLink}" style="
                    display: inline-block;
                    padding: 12px 24px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #4A90E2;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    margin-right: 10px;
                  ">Approve</a>
                  <a href="${disapprovalLink}" style="
                    display: inline-block;
                    padding: 12px 24px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #E24A4A;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    margin-left: 10px;
                  ">Disapprove</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center; color: #777; font-size: 12px;">
                  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                  ${footerText || 'Thank you for using SWAP! For assistance, please contact support at <a href="mailto:support@ice-hub.biz" style="color: #4A90E2; text-decoration: none;">support@ice-hub.biz</a>'}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

/**
 * Generates an HTML email template for user approval notification.
 * @param {Object} options - Options for email content.
 * @param {string} options.username - The user's username.
 * @returns {string} HTML email template.
 */
export const createApprovalEmailTemplate = ({ username }) => `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h2 style="color: #4A90E2; font-size: 24px; margin: 0;">Welcome to SWAP, ${username}!</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; font-size: 16px; line-height: 1.6; color: #333; text-align: center;">
                  <p>Your registration has been approved! You can now log in to your account and start using SWAP.</p>
                  <p>If you have any questions, feel free to reach out to our support team. We're here to help!</p>
                  <p>Welcome aboard, and enjoy using SWAP!</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center; color: #777; font-size: 12px;">
                  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                  Thank you for choosing SWAP! For assistance, please contact support at <a href="mailto:support@ice-hub.biz" style="color: #4A90E2; text-decoration: none;">support@ice-hub.biz</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

export const createDisapprovalEmailTemplate = ({ username }) => `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h2 style="color: #E24A4A; font-size: 24px; margin: 0;">Registration Disapproved</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; font-size: 16px; line-height: 1.6; color: #333; text-align: center;">
                  <p>Dear ${username},</p>
                  <p>We regret to inform you that your registration request has not been approved at this time.</p>
                  <p>If you have any questions or believe this was a mistake, please feel free to contact our support team.</p>
                  <p>Thank you for your understanding.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center; color: #777; font-size: 12px;">
                  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                  For further assistance, please contact support at <a href="mailto:support@ice-hub.biz" style="color: #4A90E2; text-decoration: none;">support@ice-hub.biz</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

/**
 * Generates an HTML email template for password reset.
 * @param {Object} options - Options for email content.
 * @param {string} options.resetLink - The password reset link.
 * @param {string} [options.footerText] - Optional footer text.
 * @returns {string} HTML email template.
 */
export const createPasswordResetTemplate = ({ resetLink, footerText }) => `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h2 style="color: #4A90E2; font-size: 24px; margin: 0;">Password Reset Request</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; font-size: 16px; line-height: 1.6; color: #333; text-align: center;">
                  <p>We received a request to reset your password. Click the button below to set a new password:</p>
                  <p><a href="${resetLink}" style="
                    display: inline-block;
                    padding: 12px 24px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #4A90E2;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                  ">Reset Password</a></p>
                  <p>If you did not request a password reset, please ignore this email or contact support.</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; text-align: center; color: #777; font-size: 12px;">
                  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                  ${footerText || 'For assistance, please contact support at <a href="mailto:support@ice-hub.biz" style="color: #4A90E2; text-decoration: none;">support@ice-hub.biz</a>'}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;