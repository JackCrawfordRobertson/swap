// secretsManager.js

const isServer = typeof window === "undefined";
const isProduction = process.env.NODE_ENV === "production";

// Load environment variables in development on the server
if (!isProduction && isServer) {
  const { config } = require('dotenv');
  console.log("Loading environment variables from .env.development...");
  const result = config({ path: ".env.development" });

  if (result.error) {
    console.error("Failed to load .env.development file:", result.error);
  } else {
    console.log(".env.development file loaded successfully.");
  }
}

/**
 * Retrieve secrets from environment variables.
 * @returns {Object} The secrets object.
 */
export const getSecrets = () => {
  const secrets = process.env;

  // Log sanitized secrets (hide sensitive values)
  const sanitizedSecrets = Object.keys(secrets).reduce((acc, key) => {
    acc[key] =
      secrets[key] && secrets[key].length > 4
        ? "***" + secrets[key].slice(-4)
        : secrets[key];
    return acc;
  }, {});

  console.log("Secrets Loaded (Sanitized):", sanitizedSecrets);

  return secrets;
};