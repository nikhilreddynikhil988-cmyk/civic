# Deployment Guide for Civic Issues Portal

This guide provides step-by-step instructions for deploying the Civic Issues Portal application to production.

## Prerequisites

Before deploying, ensure you have:
- A MongoDB Atlas account (or other MongoDB hosting)
- Accounts on your chosen deployment platforms (Render for backend, Vercel for frontend recommended)
- Git installed and your code committed to a Git repository (GitHub, GitLab, etc.)

## Part 1: MongoDB Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose the FREE tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and strong password (save these!)
   - Set privileges to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`)
   - Replace `<password>` with your actual database user password
   - Add a database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/civic-issues`

## Part 2: Backend Deployment (Render)

1. **Prepare Your Code**
   - Ensure your server code is in a Git repository
   - Make sure `server/.env.example` exists (already created)

2. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with your GitHub/GitLab account

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Configure the service:
     - **Name**: `civic-issues-api` (or your preferred name)
     - **Root Directory**: `server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Set Environment Variables**
   - In the "Environment" section, add:
     - `MONGO_URI`: Your MongoDB connection string from Part 1
     - `JWT_SECRET`: Generate a secure random string (e.g., use https://randomkeygen.com/)
     - `PORT`: Leave empty (Render sets this automatically)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Copy your service URL (e.g., `https://civic-issues-api.onrender.com`)

6. **Test Backend**
   - Visit your service URL in a browser
   - You should see: "Civic Issues API is running"

## Part 3: Frontend Deployment (Vercel)

1. **Update Environment Variable**
   - In your local `client/.env` file, update:
     ```
     REACT_APP_API_URL=https://your-render-service-url.onrender.com
     ```
   - Replace with your actual Render service URL from Part 2
   - Commit this change to your Git repository

2. **Create Vercel Account**
   - Go to [Vercel](https://vercel.com)
   - Sign up with your GitHub/GitLab account

3. **Import Project**
   - Click "Add New..." → "Project"
   - Import your Git repository
   - Vercel will auto-detect it's a monorepo

4. **Configure Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. **Set Environment Variables**
   - In "Environment Variables" section, add:
     - **Key**: `REACT_APP_API_URL`
     - **Value**: Your Render backend URL (e.g., `https://civic-issues-api.onrender.com`)
     - Select all environments (Production, Preview, Development)

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (3-5 minutes)
   - Copy your deployment URL (e.g., `https://civic-issues.vercel.app`)

## Part 4: Verification

### Test Backend API
1. Visit `https://your-backend-url.onrender.com`
2. Should display: "Civic Issues API is running"

### Test Frontend Application
1. Visit your Vercel URL
2. Test the following flows:

   **User Registration & Login**
   - Register a new citizen account
   - Login with the credentials
   
   **File a Complaint**
   - Click "File Complaint"
   - Fill in all fields (title, category, description)
   - Upload a photo
   - Select location on map
   - Submit
   
   **Admin Dashboard**
   - Register an admin account (role: admin)
   - Login as admin
   - View all complaints
   - Change complaint status
   
   **Worker Dashboard**
   - Register a worker account (role: worker)
   - Login as worker
   - View assigned tasks
   - Update task status

### Check for Issues
- Open browser console (F12) and check for errors
- Verify images load correctly
- Test all user flows end-to-end
- Check that data persists in MongoDB Atlas

## Troubleshooting

### Backend Issues

**"MongoDB Connection Error"**
- Verify your MongoDB connection string is correct
- Ensure IP whitelist includes 0.0.0.0/0
- Check database user credentials

**"Cannot connect to backend"**
- Check Render service logs
- Verify environment variables are set correctly
- Ensure service is running (not sleeping on free tier)

### Frontend Issues

**"Network Error" or API calls failing**
- Verify `REACT_APP_API_URL` is set correctly in Vercel
- Check that backend URL is accessible
- Ensure CORS is enabled on backend (already configured)

**Images not loading**
- Check that backend `/uploads` route is working
- Verify image URLs are correct in browser network tab

**Environment variable not working**
- Redeploy the frontend after setting environment variables
- Environment variables must start with `REACT_APP_` for Create React App

### Free Tier Limitations

**Render Free Tier**
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- 750 hours/month free (enough for one service running 24/7)

**Vercel Free Tier**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

## Updating Your Deployment

### Update Backend
1. Push changes to your Git repository
2. Render will automatically redeploy

### Update Frontend
1. Push changes to your Git repository
2. Vercel will automatically redeploy

### Update Environment Variables
- **Render**: Dashboard → Service → Environment → Edit
- **Vercel**: Dashboard → Project → Settings → Environment Variables

## Next Steps

- Set up custom domain (optional)
- Configure email notifications (requires additional setup)
- Set up monitoring and analytics
- Implement automated backups for MongoDB

## Support

If you encounter issues:
1. Check service logs (Render/Vercel dashboards)
2. Verify all environment variables are set correctly
3. Test API endpoints directly using Postman or curl
4. Check MongoDB Atlas for connection issues
