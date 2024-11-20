// secretsManager.js

import { config } from "dotenv";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

// Check if the code is running in the server environment (Node.js)
const isServer = typeof window === "undefined";
const isProduction = process.env.NODE_ENV === "production";

// Load environment variables in development on the server
if (!isProduction && isServer) {
  console.log("Loading environment variables from .env.development...");
  const result = config({ path: ".env.development" });

  if (result.error) {
    console.error("Failed to load .env.development file:", result.error);
  } else {
    console.log(".env.development file loaded successfully.");
  }
}

const secretName = "swap-config-key"; // AWS Secrets Manager secret name
const region = process.env.MY_AWS_REGION || "eu-west-2";

let secrets; // Cache for secrets

// Initialize AWS Secrets Manager client (only on the server)
const client = isServer
  ? new SecretsManagerClient({
      region,
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

/**
 * Fetch secrets from AWS Secrets Manager.
 * @returns {Promise<Object>} The parsed secrets object.
 */
const fetchSecretsFromAWS = async () => {
  if (!client) {
    throw new Error("AWS Secrets Manager client is not available in the browser.");
  }

  try {
    console.log(`Fetching secrets from AWS Secrets Manager (region: ${region})...`);
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: "AWSCURRENT",
      })
    );
    console.log("Secrets successfully fetched from AWS Secrets Manager.");
    return JSON.parse(response.SecretString);
  } catch (error) {
    console.error("Error fetching secrets from AWS Secrets Manager:", error);
    throw new Error("Failed to fetch secrets from AWS Secrets Manager.");
  }
};

/**
 * Fetch secrets from either local environment variables or AWS Secrets Manager.
 * @returns {Promise<Object>} The secrets object.
 */
export const fetchSecrets = async () => {
  if (!isProduction) {
    console.log("Using local environment variables for secrets.");
    if (isServer) {
      return process.env; // Use local environment variables on the server
    } else {
      // On the client side, return variables prefixed with NEXT_PUBLIC_
      const clientEnvVars = Object.keys(process.env)
        .filter((key) => key.startsWith("NEXT_PUBLIC_"))
        .reduce((acc, key) => {
          acc[key] = process.env[key];
          return acc;
        }, {});
      return clientEnvVars;
    }
  }

  console.log("Environment is production. Fetching secrets from AWS Secrets Manager...");
  return await fetchSecretsFromAWS();
};

/**
 * Retrieve secrets, caching them for future use.
 * Dynamically set environment variables in production for consistency.
 * @returns {Promise<Object>} The cached secrets object.
 */
export const getSecrets = async () => {
  if (!secrets) {
    secrets = await fetchSecrets();
  }

  if (isProduction && secrets) {
    Object.keys(secrets).forEach((key) => {
      if (!process.env[key]) {
        process.env[key] = secrets[key];
        console.log(`Environment variable ${key} set dynamically.`);
      }
    });
  }

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

/**
 * Log the current environment and secrets source.
 */
const logEnvironment = () => {
  console.log(`Current Environment: ${process.env.NODE_ENV || "undefined"}`);
  console.log(
    `Secrets Source: ${isProduction ? "AWS Secrets Manager" : ".env.development"}`
  );
};

// Log environment details on load
if (isServer) {
  logEnvironment();
}