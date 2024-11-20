# SWAP x ICE-HUB

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Getting Started
### Development Server
To start the development server:

# Using Yarn
```bash
yarn dev
```

Ensure that your environment variables are correctly configured in a .env file. Supported environment modes include .env.development for development builds.

# To switch/test environments manually, use:
```bash
NODE_ENV=development yarn dev
NODE_ENV=production yarn build && yarn start
```

# Fetching Secrets

Secrets are dynamically fetched using a script before builds. To retrieve secrets, use:
```bash
node src/config/fetch-secrets.js
```

# Test Build localy pre push for Production
```bash
# Fetch secrets and build
node src/config/fetch-secrets.js && yarn build
```

# Netlify Deployment
1. Ensure your build.command in the Netlify dashboard is set to:
```bash
node src/config/fetch-secrets.js && yarn build
```

2. Set the publish directory to .next.

3. Environment variables such as MY_AWS_ACCESS_KEY_ID, MY_AWS_SECRET_ACCESS_KEY, and MY_AWS_REGION must be configured in the Netlify environment.
