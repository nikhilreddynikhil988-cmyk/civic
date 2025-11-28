# GitHub Deployment Guide

This guide shows you how to push your Civic Issues Portal to GitHub and deploy it using GitHub integration with Render and Vercel.

## Prerequisites

- Git installed on your computer
- GitHub account
- Your code ready (already prepared for deployment)

## Part 1: Push Code to GitHub

### Step 1: Initialize Git Repository (if not already done)

```bash
# Navigate to your project root
cd c:\Users\reddy\website\civic-rep

# Initialize git (skip if already initialized)
git init

# Check status
git status
```

### Step 2: Create .gitignore (Root Level)

Create a `.gitignore` file in the root directory:

```
# Environment files
.env
.env.local
.env.production

# Dependencies
node_modules/

# Build outputs
client/build/
server/uploads/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

### Step 3: Commit Your Code

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - Civic Issues Portal ready for deployment"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon → **"New repository"**
3. Fill in:
   - **Repository name**: `civic-issues-portal` (or your preferred name)
   - **Description**: "A web platform for reporting and managing civic issues"
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (you already have code)
4. Click **"Create repository"**

### Step 5: Push to GitHub

GitHub will show you commands. Use these:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/civic-issues-portal.git

# Push code
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

**✅ Your code is now on GitHub!**

---

## Part 2: Deploy Backend to Render (via GitHub)

### Step 1: Sign Up for Render

1. Go to [Render.com](https://render.com)
2. Click **"Get Started"**
3. **Sign up with GitHub** (this connects your account)

### Step 2: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Find and select your `civic-issues-portal` repository
4. Click **"Connect"**

### Step 3: Configure Service

Fill in the following:

- **Name**: `civic-issues-api`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### Step 4: Add Environment Variables

Scroll to **"Environment Variables"** section and add:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A secure random string (e.g., `your-secret-key-here-make-it-long-and-random`) |

**To get MongoDB URI:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (if you haven't)
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Add database name at the end: `/civic-issues`

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, copy your service URL (e.g., `https://civic-issues-api.onrender.com`)

### Step 6: Test Backend

Visit your Render URL in a browser. You should see:
```
Civic Issues API is running
```

---

## Part 3: Deploy Frontend to Vercel (via GitHub)

### Step 1: Sign Up for Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. **Sign up with GitHub** (this connects your account)

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find your `civic-issues-portal` repository
3. Click **"Import"**

### Step 3: Configure Project

Vercel will auto-detect settings, but verify:

- **Framework Preset**: Create React App
- **Root Directory**: `client`
- **Build Command**: `npm run build` (or leave default)
- **Output Directory**: `build` (or leave default)
- **Install Command**: `npm install` (or leave default)

### Step 4: Add Environment Variables

**IMPORTANT**: Add this environment variable:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | Your Render backend URL (e.g., `https://civic-issues-api.onrender.com`) |

**Make sure to:**
- ✅ Select all environments (Production, Preview, Development)
- ✅ Do NOT include a trailing slash in the URL

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 3-5 minutes
3. Once deployed, you'll get a URL like: `https://civic-issues-portal.vercel.app`

### Step 6: Test Frontend

1. Visit your Vercel URL
2. Test user registration and login
3. Try filing a complaint
4. Check admin and worker dashboards

---

## Part 4: Automatic Deployments

**🎉 You're now set up for automatic deployments!**

Every time you push changes to GitHub:
- ✅ Render will automatically redeploy your backend
- ✅ Vercel will automatically redeploy your frontend

### Making Updates

```bash
# Make your code changes
# Then commit and push:

git add .
git commit -m "Description of your changes"
git push origin main
```

Both Render and Vercel will automatically detect the push and redeploy!

---

## Part 5: Verification Checklist

After deployment, test these features:

### User Flow
- [ ] Register a new citizen account
- [ ] Login with credentials
- [ ] File a complaint with photo and location
- [ ] View "My Complaints" page

### Admin Flow
- [ ] Register an admin account
- [ ] Login as admin
- [ ] View all complaints in dashboard
- [ ] Change complaint status

### Worker Flow
- [ ] Register a worker account
- [ ] Login as worker
- [ ] View assigned tasks
- [ ] Update task status

### Technical Checks
- [ ] All images load correctly
- [ ] No console errors (F12 in browser)
- [ ] API calls work (check Network tab)
- [ ] Data persists in MongoDB

---

## Troubleshooting

### "Cannot connect to backend"
- Check that `REACT_APP_API_URL` in Vercel matches your Render URL exactly
- Ensure Render service is running (free tier sleeps after 15 min inactivity)
- Check Render logs for errors

### "MongoDB connection failed"
- Verify MongoDB Atlas connection string is correct
- Check that IP whitelist includes `0.0.0.0/0`
- Ensure database user has correct permissions

### "Images not loading"
- Check that backend URL is correct
- Verify `/uploads` folder exists in server
- Check browser console for CORS errors

### Environment Variables Not Working
- Redeploy after adding/changing environment variables
- For React, variables MUST start with `REACT_APP_`
- Check deployment logs for confirmation

---

## Custom Domain (Optional)

### Vercel Custom Domain
1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Render Custom Domain
1. Upgrade to paid plan (custom domains not available on free tier)
2. Go to your service → "Settings" → "Custom Domain"
3. Add your domain and configure DNS

---

## Summary

**What you've accomplished:**
- ✅ Code pushed to GitHub
- ✅ Backend deployed to Render (auto-deploys on push)
- ✅ Frontend deployed to Vercel (auto-deploys on push)
- ✅ MongoDB database configured
- ✅ Automatic deployments enabled

**Your live URLs:**
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`
- **GitHub**: `https://github.com/YOUR_USERNAME/civic-issues-portal`

**Next time you make changes:**
```bash
git add .
git commit -m "Your changes"
git push origin main
```
Both services will automatically redeploy! 🚀
