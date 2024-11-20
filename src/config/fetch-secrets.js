// fetch-secrets.js

const fs = require('fs');
const { GetSecretValueCommand, SecretsManagerClient } = require('@aws-sdk/client-secrets-manager');

(async () => {
  const secretName = 'swap-config-key'; // Your AWS Secrets Manager secret name
  const region = process.env.MY_AWS_REGION || 'eu-west-2';

  const client = new SecretsManagerClient({
    region,
    credentials: {
      accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    console.log('Fetching secrets from AWS Secrets Manager...');
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: 'AWSCURRENT',
      })
    );
    const secrets = JSON.parse(response.SecretString);

    // Build .env.production.local content
    let envContent = '';
    for (const [key, value] of Object.entries(secrets)) {
      envContent += `${key}=${value}\n`;
    }

    // Write to .env.production.local
    fs.writeFileSync('.env.production.local', envContent);
    console.log('.env.production.local file created successfully.');
  } catch (error) {
    console.error('Error fetching secrets from AWS Secrets Manager:', error);
    process.exit(1);
  }
})();