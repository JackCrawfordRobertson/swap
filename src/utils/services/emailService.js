/**
 * Sends an email by calling the `/api/send-email` API route.
 * @param {Object} emailData - Email data including `to`, `from`, `subject`, `html`, and `text`.
 * @returns {Promise<void>} - Resolves when the email is sent.
 */
export const sendEmail = async (emailData) => {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });
  
    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(`Failed to send email: ${message}`);
    }
  };