# 🚂 Deploy SafeCity from GitHub to Railway

Complete step-by-step guide to deploy your Crime Reporting System using GitHub and Railway.

---

## 🎯 Why Railway?

- ✅ **Free Tier:** $5 credit/month (enough for small projects)
- ✅ **Easy Setup:** Deploy directly from GitHub
- ✅ **Auto Deploy:** Automatic deployments on git push
- ✅ **Built-in Database:** MySQL included
- ✅ **Environment Variables:** Easy configuration
- ✅ **Custom Domains:** Free SSL certificates
- ✅ **Logs & Monitoring:** Built-in dashboard

---

## 📋 Prerequisites

1. **GitHub Account:** https://github.com/signup
2. **Railway Account:** https://railway.app/
3. **Your code pushed to GitHub**

---

## 🚀 Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

1. **Create a new repository on GitHub:**
   - Go to: https://github.com/new
   - Repository name: `safecity-crime-reporting`
   - Make it Public or Private
   - Click "Create repository"

2. **Push your code:**
   ```bash
   cd F:\charan\Crime_Reporting
   
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - SafeCity Crime Reporting System"
   
   # Add remote
   git remote add origin https://github.com/YOUR_USERNAME/safecity-crime-reporting.git
   
   # Push to GitHub
   git push -u origin main
   ```
   
   **Note:** If you get an error about 'main' branch, try:
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Sign Up for Railway

1. **Go to:** https://railway.app/
2. **Click "Login"**
3. **Sign in with GitHub** (recommended)
4. **Authorize Railway** to access your GitHub repositories

---

### Step 3: Create New Project on Railway

1. **Click "New Project"**
2. **Select "Deploy from GitHub repo"**
3. **Choose your repository:** `safecity-crime-reporting`
4. **Click "Deploy Now"**

Railway will automatically detect your Node.js project!

---

### Step 4: Add MySQL Database

1. **In your Railway project, click "New"**
2. **Select "Database"**
3. **Choose "Add MySQL"**
4. **Wait for database to provision** (takes ~30 seconds)

---

### Step 5: Configure Environment Variables

1. **Click on your main service** (safecity-crime-reporting)
2. **Go to "Variables" tab**
3. **Add these variables:**

```env
# Database (Railway will auto-fill these from MySQL service)
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_PORT=${{MySQL.MYSQL_PORT}}

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string

# Gemini API Key (optional - for AI classification)
GEMINI_API_KEY=your-gemini-api-key-if-you-have-one

# Email Configuration (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Port (Railway auto-assigns, but we set default)
PORT=3000

# Node Environment
NODE_ENV=production
```

**To use Railway's MySQL variables:**
- Click "Add Variable"
- Select "Add Reference"
- Choose the MySQL service
- Select the variable (MYSQL_HOST, MYSQL_USER, etc.)

---

### Step 6: Setup Database Schema

1. **Click on MySQL service**
2. **Go to "Data" tab**
3. **Click "Connect"** to get connection details

4. **Connect using MySQL client:**
   ```bash
   mysql -h MYSQL_HOST -u MYSQL_USER -p MYSQL_DATABASE
   ```
   
5. **Run your schema:**
   ```bash
   # Copy the contents of database/schema.sql
   # Paste into MySQL client
   ```

**Or use Railway's built-in query tool:**
- Go to MySQL service → "Query" tab
- Paste your schema.sql content
- Click "Run"

---

### Step 7: Configure Build Settings

Railway should auto-detect your setup, but verify:

1. **Click on your service**
2. **Go to "Settings" tab**
3. **Verify:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `/` (leave empty)

---

### Step 8: Deploy!

1. **Railway will automatically deploy**
2. **Watch the logs** in the "Deployments" tab
3. **Wait for "Success" status** (takes 2-5 minutes)

---

### Step 9: Get Your URL

1. **Go to "Settings" tab**
2. **Scroll to "Domains"**
3. **Click "Generate Domain"**
4. **Your app will be live at:** `https://your-app.up.railway.app`

---

## 🔧 Project Structure for Railway

Make sure you have these files in your repository:

```
Crime_Reporting/
├── package.json          ✅ (Root - for Railway)
├── server/
│   ├── server.js        ✅ (Main entry point)
│   ├── package.json     ✅ (Server dependencies)
│   └── ...
├── client/              ✅ (Frontend files)
├── ml-model/            ✅ (ML service)
├── database/            ✅ (Schema files)
└── .gitignore          ✅ (Important!)
```

---

## 📝 Create/Update `.gitignore`

Create a `.gitignore` file in your root directory:

```gitignore
# Dependencies
node_modules/
server/node_modules/

# Environment variables
.env
server/.env

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Uploads (don't commit user uploads)
server/uploads/*
!server/uploads/.gitkeep

# Python
__pycache__/
*.pyc
*.pyo
ml-model/__pycache__/

# Database
*.sql.backup
*.db
```

---

## 🔄 Auto-Deploy on Git Push

Once set up, Railway automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main

# Railway automatically detects and deploys! 🚀
```

---

## 🐍 Deploy ML Service Separately (Optional)

If you want to run the ML classification service:

1. **In Railway project, click "New"**
2. **Select "GitHub Repo"**
3. **Choose same repository**
4. **Configure:**
   - **Root Directory:** `/ml-model`
   - **Start Command:** `python predict.py`
   - **Port:** `5000`

5. **Add environment variables:**
   ```env
   GEMINI_API_KEY=your-api-key
   PORT=5000
   ```

6. **Update backend to use Railway ML service URL:**
   - Get ML service URL from Railway
   - Update `server/.env`: `ML_SERVICE_URL=https://your-ml-service.railway.app`

---

## 🌐 Custom Domain (Optional)

1. **Go to your service → Settings → Domains**
2. **Click "Custom Domain"**
3. **Enter your domain:** `safecity.yourdomain.com`
4. **Add CNAME record to your DNS:**
   ```
   Type: CNAME
   Name: safecity
   Value: your-app.up.railway.app
   ```
5. **Wait for DNS propagation** (5-30 minutes)
6. **SSL certificate is automatic!** ✅

---

## 📊 Monitoring & Logs

### View Logs:
1. Click on your service
2. Go to "Deployments" tab
3. Click on latest deployment
4. View real-time logs

### Monitor Usage:
1. Go to project dashboard
2. View CPU, Memory, Network usage
3. Check monthly credit usage

---

## 💰 Pricing

### Free Tier:
- **$5 credit/month** (resets monthly)
- **500 hours** of usage
- **100 GB** bandwidth
- **1 GB** RAM per service

### Usage Estimate:
- **Backend:** ~$2-3/month
- **Database:** ~$1-2/month
- **ML Service:** ~$1-2/month
- **Total:** ~$4-7/month (within free tier!)

### Paid Plans:
- **Hobby:** $5/month (more resources)
- **Pro:** $20/month (team features)

---

## 🔧 Troubleshooting

### Issue: Build Failed

**Check:**
1. `package.json` exists in root
2. All dependencies are listed
3. Node version is compatible

**Solution:**
```json
// In package.json, add:
"engines": {
  "node": "18.x",
  "npm": "9.x"
}
```

### Issue: Database Connection Failed

**Check:**
1. Environment variables are set correctly
2. MySQL service is running
3. Database schema is imported

**Solution:**
```bash
# Get database URL from Railway
# Connect and verify schema exists
mysql -h HOST -u USER -p DATABASE
SHOW TABLES;
```

### Issue: App Crashes on Start

**Check logs:**
1. Go to Deployments → Latest → Logs
2. Look for error messages

**Common fixes:**
- Missing environment variables
- Wrong start command
- Port configuration issue

### Issue: ML Service Not Working

**Solution:**
1. Deploy ML service separately
2. Update backend environment variable
3. Verify ML service is running

---

## 🚀 Quick Commands Reference

```bash
# Push changes
git add .
git commit -m "Your message"
git push origin main

# View Railway CLI (optional)
npm install -g @railway/cli
railway login
railway logs
railway status
```

---

## ✅ Deployment Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] `.gitignore` file created
- [ ] `package.json` in root directory
- [ ] Environment variables prepared
- [ ] Database schema ready

After deploying:
- [ ] Check deployment logs
- [ ] Verify database connection
- [ ] Test registration
- [ ] Test login
- [ ] Test report submission
- [ ] Test ML classification
- [ ] Test file uploads
- [ ] Verify SSL certificate

---

## 📚 Additional Resources

- **Railway Docs:** https://docs.railway.app/
- **Railway Discord:** https://discord.gg/railway
- **GitHub Docs:** https://docs.github.com/
- **Railway Templates:** https://railway.app/templates

---

## 🎯 Summary

**Steps:**
1. ✅ Push code to GitHub
2. ✅ Sign up for Railway
3. ✅ Create new project from GitHub
4. ✅ Add MySQL database
5. ✅ Configure environment variables
6. ✅ Import database schema
7. ✅ Deploy!
8. ✅ Get your URL
9. ✅ Your site is LIVE! 🎉

**Time:** ~15 minutes
**Cost:** FREE (within $5 credit)
**Auto-deploy:** YES (on git push)

---

## 🆘 Need Help?

If you encounter issues:
1. Check Railway logs
2. Verify environment variables
3. Check database connection
4. Review GitHub repository
5. Ask on Railway Discord

---

**Ready to deploy? Follow the steps above and your SafeCity website will be live in 15 minutes!** 🚀
