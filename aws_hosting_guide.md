# AWS Hosting Guide for Trading Journal

This guide explains how to host your Trading Journal on AWS Amplify for free (or very low cost) while keeping it private using the Basic Auth we just implemented.

## 1. Prerequisites
- **AWS Account**: [Sign up here](https://aws.amazon.com/) if you don't have one.
- **GitHub Account**: Your code should be pushed to a GitHub repository.

## 2. Configure Security Locally
We have added `middleware.ts` to protect your app. You need to set your username and password.

1.  Create a file named `.env.local` in the root of your project (`c:\Users\tej04\Trading Journal\trading-journal\.env.local`).
2.  Add the following content:
    ```env
    AUTH_USER=myusername
    AUTH_PASS=mypassword
    ```
3.  Restart your local server (`npm run dev`) and try to access the site. You should see a login prompt.

## 3. Deploy to AWS Amplify

1.  **Log in to AWS Console** and search for **"Amplify"**.
2.  Click **"Create new app"** (or "Get Started").
3.  Select **"GitHub"** as the source and click Next.
4.  Authorize AWS Amplify to access your GitHub account.
5.  Select your **Trading Journal repository** and the branch (usually `main`).
6.  **Build Settings**: Amplify usually auto-detects Next.js. Just click **Next**.
7.  **Review**: Click **Save and Deploy**.

## 4. Configure Security on AWS
Your app will fail to build or allow anyone in if you don't set the environment variables in AWS.

1.  In the Amplify Console, go to your app.
2.  In the left sidebar, click **"Environment variables"**.
3.  Click **"Manage variables"**.
4.  Add the same variables you used locally:
    - Key: `AUTH_USER`, Value: `myusername`
    - Key: `AUTH_PASS`, Value: `mypassword`
5.  Click **Save**.
6.  **Redeploy**: Go back to the "Hosting" or "Builds" tab and trigger a new build (or just push a small change to GitHub).

## 5. Important: Data Persistence
> [!WARNING]
> **Your data is stored in the browser!**

Since this app uses `localStorage`:
- Data **will not sync** between your phone and laptop.
- If you clear your browser cookies/cache, **you will lose your data**.
- To backup your data, you might want to add a "Export Data" feature in the future.

## 6. Cost Management
- AWS Amplify Free Tier: 1000 build minutes/month and 5 GB stored/month. This is usually enough for personal use.
- If you exceed this, it costs pennies.
- To be safe, you can set up **AWS Budgets** to alert you if costs exceed $1.00.
