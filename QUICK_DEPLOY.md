# 🚀 Quick Deployment Guide

## Fastest Way to Deploy SafeCity

### Option 1: Heroku (Easiest - 5 Minutes)

1. **Install Heroku CLI:**
   - Download: https://devcenter.heroku.com/articles/heroku-cli
   - Or run: `winget install Heroku.HerokuCLI`

2. **Run deployment script:**
   ```
   Double-click: deploy-heroku.bat
   ```

3. **Follow the prompts:**
   - Login to Heroku
   - Enter app name
   - Enter JWT secret
   - Enter Gemini API key (optional)

4. **Done!** Your app will open automatically.

---

### Option 2: Vercel (Frontend Only - 2 Minutes)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd client
   vercel
   ```

3. **Follow prompts** and your site is live!

---

### Option 3: Netlify (Drag & Drop - 1 Minute)

1. Go to: https://app.netlify.com/drop
2. Drag the `client` folder
3. Done! Your site is live.

**Note:** For full functionality, you'll need to deploy the backend separately.

---

## What You Need

### Required:
- ✅ Heroku account (free): https://signup.heroku.com/
- ✅ Git installed
- ✅ Your code ready

### Optional:
- Gemini API key (for AI classification)
- Custom domain name
- Email service credentials

---

## After Deployment

### Get Your Database Credentials:
```bash
heroku config:get JAWSDB_URL -a your-app-name
```

### View Logs:
```bash
heroku logs --tail -a your-app-name
```

### Restart App:
```bash
heroku restart -a your-app-name
```

### Open App:
```bash
heroku open -a your-app-name
```

---

## Troubleshooting

### Issue: "Heroku CLI not found"
**Solution:** Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli

### Issue: "Git not found"
**Solution:** Install Git from https://git-scm.com/downloads

### Issue: "Database connection failed"
**Solution:** 
1. Get database URL: `heroku config:get JAWSDB_URL`
2. Update your `.env` file with the credentials
3. Restart: `heroku restart`

### Issue: "App crashed"
**Solution:**
1. Check logs: `heroku logs --tail`
2. Verify all environment variables are set
3. Check if all dependencies are in `package.json`

---

## Cost

### Heroku Free Tier:
- ✅ 550-1000 dyno hours/month (free)
- ✅ JawsDB MySQL (5MB free)
- ✅ SSL certificate included
- ✅ Custom domain support

### Paid Plans (Optional):
- Hobby: $7/month (no sleep, more hours)
- Standard: $25/month (better performance)

---

## Next Steps

After deployment:
1. ✅ Test your live site
2. ✅ Configure custom domain (optional)
3. ✅ Setup SSL certificate (automatic on Heroku)
4. ✅ Monitor logs and performance
5. ✅ Share your site URL!

---

## Quick Commands Reference

```bash
# Deploy
git push heroku main

# View logs
heroku logs --tail

# Restart
heroku restart

# Open app
heroku open

# Check status
heroku ps

# Set environment variable
heroku config:set KEY=value

# View environment variables
heroku config
```

---

## Support

Need help? Check:
- 📖 Full guide: DEPLOYMENT_GUIDE.md
- 🌐 Heroku docs: https://devcenter.heroku.com/
- 💬 Heroku support: https://help.heroku.com/

---

**Ready? Run `deploy-heroku.bat` and you'll be live in 5 minutes!** 🚀
