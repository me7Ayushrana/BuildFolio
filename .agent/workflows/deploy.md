---
description: Buildfolio Online Deployment Guide (Vercel + Render)
---

# 🚀 Buildfolio Online Deployment Guide

Follow these steps to deploy Buildfolio to the cloud.

## 1. Prepare GitHub Repository
1. Create a **new public or private repository** on GitHub.
2. Initialize and push the local codebase:
```bash
git init
git add .
git commit -m "Initialize Buildfolio Social Perfection"
git remote add origin https://github.com/YOUR_USERNAME/buildfolio.git
git branch -M main
git push -u origin main
```

## 2. Deploy Backend (Render.com)
1. Go to [Render.com](https://render.com) and sign in with GitHub.
2. Click **New +** -> **Web Service**.
3. Select your `buildfolio` repository.
4. Configure the service:
   - **Name**: `buildfolio-server`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Environment Variables**:
   - `MONGODB_URI`: [Your MongoDB Atlas Connection String]
   - `JWT_SECRET`: [A secure random string]
   - `FIREBASE_PROJECT_ID`: [From Firebase Console]
   - `CLOUDINARY_CLOUD_NAME`: [From Cloudinary Dashboard]
   - `CLOUDINARY_API_KEY`: [From Cloudinary Dashboard]
   - `CLOUDINARY_API_SECRET`: [From Cloudinary Dashboard]
6. Copy the **Render URL** (e.g., `https://buildfolio-server.onrender.com`).

## 3. Deploy Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** -> **Project**.
3. Import your `buildfolio` repository.
4. Configure the project:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `client`
5. **Environment Variables**:
   - `NEXT_PUBLIC_BACKEND_URL`: [Your Render URL]/api
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: [From Firebase]
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: [From Firebase]
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: [From Firebase]
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: [From Firebase]
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: [From Firebase]
   - `NEXT_PUBLIC_FIREBASE_APP_ID`: [From Firebase]
6. Click **Deploy**.

## 4. Final Polish
- Ensure your Vercel URL is added to the `CORS` whitelist in `server/src/index.ts` (Already pre-configured for `*.vercel.app`).
- Verify that Firebase Authentication has the Vercel domain in the "Authorized Domains" list.
