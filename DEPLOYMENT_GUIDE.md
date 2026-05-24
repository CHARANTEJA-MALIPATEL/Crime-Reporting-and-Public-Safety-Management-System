# 🚀 SafeCity Deployment Guide

Complete guide to deploy your Crime Reporting & Public Safety System to the web.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:
- [ ] MySQL database is set up
- [ ] All environment variables are configured
- [ ] ML classification service is working
- [ ] Backend API is tested
- [ ] Frontend is tested locally

---

## 🌐 Deployment Options

### Option 1: Heroku (Recommended for Beginners)
**Best for:** Quick deployment, free tier available
**Cost:** Free tier available, paid plans from $7/month

### Option 2: Vercel + Railway
**Best for:** Modern deployment, separate frontend/backend
**Cost:** Free tier available

### Option 3: AWS (Amazon Web Services)
**Best for:** Production, scalability
**Cost:** Pay as you go

### Option 4: DigitalOcean
**Best for:** Full control, VPS hosting
**Cost:** From $5/month

### Option 5: Netlify + Heroku
**Best for:** Static frontend + backend API
**Cost:** Free tier available

---

## 🎯 Recommended: Heroku Deployment (Full Stack)

### Step 1: Prepare Your Project

1. **Create a `Procfile` in the root directory:**
```
web: node server/server.js
worker: python ml-model/predict.py
```

2. **Create `package.json` in root (if not exists):**
```json
{
  "name": "safecity-crime-reporting",
  "version": "1.0.0",
  "description": "Crime Reporting & Public Safety System",
  "main": "server/server.js",
  "scripts": {
    "start": "node server/server.js",
    "dev": "nodemon server/server.js"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1",
    "axios": "^1.5.0",
    "nodemailer": "^6.9.5"
  }
}
```

3. **Update `server/.env` for production:**
```env
# Database (Use JawsDB MySQL add-on on Heroku)
DB_HOST=your-jawsdb-host
DB_USER=your-jawsdb-user
DB_PASSWORD=your-jawsdb-password
DB_NAME=your-jawsdb-database

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# Gemini API (Optional)
GEMINI_API_KEY=your-gemini-api-key

# Email (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Port
PORT=3000
```

### Step 2: Deploy to Heroku

1. **Install Heroku CLI:**
```bash
# Windows
winget install Heroku.HerokuCLI

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

2. **Login to Heroku:**
```bash
heroku login
```

3. **Create Heroku App:**
```bash
cd F:\charan\Crime_Reporting
heroku create safecity-crime-reporting
```

4. **Add MySQL Database:**
```bash
heroku addons:create jawsdb:kitefin
```

5. **Get Database Credentials:**
```bash
heroku config:get JAWSDB_URL
```

6. **Set Environment Variables:**
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set GEMINI_API_KEY=your-api-key
```

7. **Deploy:**
```bash
git init
git add .
git commit -m "Initial deployment"
git push heroku main
```

8. **Open Your App:**
```bash
heroku open
```

---

## 🔥 Option 2: Vercel (Frontend) + Railway (Backend)

### Deploy Frontend to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy Frontend:**
```bash
cd client
vercel
```

3. **Follow prompts:**
- Project name: safecity-frontend
- Framework: None (static)
- Build command: (leave empty)
- Output directory: ./

### Deploy Backend to Railway

1. **Go to:** https://railway.app
2. **Sign up/Login**
3. **New Project → Deploy from GitHub**
4. **Select your repository**
5. **Add MySQL database**
6. **Set environment variables**
7. **Deploy**

---

## 🐳 Option 3: Docker Deployment

### Create `Dockerfile`:
```dockerfile
FROM node:18

# Install Python for ML service
RUN apt-get update && apt-get install -y python3 python3-pip

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd server && npm install

# Copy application files
COPY . .

# Install Python dependencies
RUN pip3 install -r ml-model/requirements.txt

# Expose ports
EXPOSE 3000 5000

# Start services
CMD ["sh", "-c", "python3 ml-model/predict.py & node server/server.js"]
```

### Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: crime_reporting_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  app:
    build: .
    ports:
      - "3000:3000"
      - "5000:5000"
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: rootpassword
      DB_NAME: crime_reporting_db
    depends_on:
      - mysql

volumes:
  mysql_data:
```

### Deploy:
```bash
docker-compose up -d
```

---

## ☁️ Option 4: AWS Deployment

### Using AWS Elastic Beanstalk

1. **Install AWS CLI:**
```bash
pip install awscli
aws configure
```

2. **Install EB CLI:**
```bash
pip install awsebcli
```

3. **Initialize:**
```bash
eb init -p node.js safecity-app
```

4. **Create Environment:**
```bash
eb create safecity-production
```

5. **Deploy:**
```bash
eb deploy
```

6. **Open:**
```bash
eb open
```

---

## 💧 Option 5: DigitalOcean Droplet

### Step 1: Create Droplet

1. Go to: https://www.digitalocean.com
2. Create Droplet (Ubuntu 22.04)
3. Choose plan ($5/month minimum)
4. Add SSH key
5. Create Droplet

### Step 2: Setup Server

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Python
apt install -y python3 python3-pip

# Install MySQL
apt install -y mysql-server

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2
```

### Step 3: Deploy Application

```bash
# Clone your repository
git clone https://github.com/yourusername/safecity.git
cd safecity

# Install dependencies
npm install
cd server && npm install && cd ..
pip3 install -r ml-model/requirements.txt

# Setup database
mysql -u root -p < database/schema.sql

# Configure environment
cp server/.env.example server/.env
nano server/.env  # Edit with your settings

# Start services with PM2
pm2 start server/server.js --name backend
pm2 start ml-model/predict.py --name ml-service --interpreter python3

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 4: Configure Nginx

```bash
nano /etc/nginx/sites-available/safecity
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /root/safecity/client;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # ML Service
    location /ml {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/safecity /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🔒 SSL Certificate (HTTPS)

### Using Let's Encrypt (Free)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your-domain.com

# Auto-renewal
certbot renew --dry-run
```

---

## 🗄️ Database Options

### Option 1: JawsDB (Heroku Add-on)
- Automatic setup with Heroku
- Free tier: 5MB
- Paid: From $10/month

### Option 2: PlanetScale
- Free tier: 5GB storage
- Serverless MySQL
- Easy scaling

### Option 3: AWS RDS
- Managed MySQL
- Free tier: 750 hours/month
- Production ready

### Option 4: DigitalOcean Managed Database
- From $15/month
- Automated backups
- Easy scaling

---

## 📊 Monitoring & Logging

### Setup PM2 Monitoring (DigitalOcean)

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# View logs
pm2 logs
pm2 monit
```

### Setup Error Tracking

Add to your backend:
```bash
npm install @sentry/node
```

---

## 🔧 Environment Variables

### Required Variables:
```env
# Database
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=crime_reporting_db

# Security
JWT_SECRET=your-super-secret-jwt-key

# Optional
GEMINI_API_KEY=your-gemini-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Production
NODE_ENV=production
PORT=3000
```

---

## ✅ Post-Deployment Checklist

- [ ] Database is accessible
- [ ] Environment variables are set
- [ ] SSL certificate is installed (HTTPS)
- [ ] Domain is configured
- [ ] Backend API is responding
- [ ] ML service is running
- [ ] File uploads are working
- [ ] Email notifications work
- [ ] Terms & Conditions page loads
- [ ] Registration works
- [ ] Login works
- [ ] Report submission works
- [ ] Admin dashboard works

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed
```bash
# Check database credentials
heroku config  # For Heroku
# Or check your .env file

# Test connection
mysql -h HOST -u USER -p DATABASE
```

### Issue: ML Service Not Running
```bash
# Check if Python dependencies are installed
pip3 list

# Check if service is running
curl http://localhost:5000/health

# Restart service
pm2 restart ml-service
```

### Issue: File Uploads Not Working
```bash
# Check uploads directory exists
mkdir -p server/uploads
chmod 755 server/uploads

# Check Nginx configuration for file size
client_max_body_size 10M;
```

---

## 📚 Additional Resources

- **Heroku Docs:** https://devcenter.heroku.com/
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app/
- **DigitalOcean Tutorials:** https://www.digitalocean.com/community/tutorials
- **AWS Docs:** https://docs.aws.amazon.com/

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| Heroku | Yes (limited) | From $7/mo | Quick start |
| Vercel | Yes | From $20/mo | Frontend |
| Railway | Yes | Pay as you go | Backend |
| DigitalOcean | No | From $5/mo | Full control |
| AWS | Yes (12 months) | Pay as you go | Enterprise |

---

## 🎯 Recommended Setup for Production

**Frontend:** Vercel (Free)
**Backend:** Railway ($5-10/month)
**Database:** PlanetScale (Free tier)
**ML Service:** Railway (included)
**Domain:** Namecheap ($10/year)
**SSL:** Let's Encrypt (Free)

**Total Cost:** ~$5-10/month

---

## 📞 Need Help?

If you encounter issues:
1. Check the logs: `pm2 logs` or `heroku logs --tail`
2. Verify environment variables
3. Test database connection
4. Check firewall settings
5. Review Nginx configuration

---

**Ready to deploy? Choose your preferred option and follow the steps!** 🚀
