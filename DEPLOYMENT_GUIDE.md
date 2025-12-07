# Deployment Guide for Render.com

## Prerequisites
1. GitHub repository with your code
2. Google OAuth credentials (already set up)
3. MongoDB Atlas account (already configured)
4. Render.com account

## Step-by-Step Deployment

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Add all features and deployment config"
git push origin main
```

### 2. Set Up Render.com

1. Go to [Render.com](https://render.com)
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository: `Jaylorddeguzman/Meet_a-like`
5. Configure the service:
   - **Name:** `charactermatch` (or your preferred name)
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Starter)

### 3. Configure Environment Variables on Render

In the Render dashboard, add these environment variables:

#### Required Variables:
```
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=your-nextauth-secret-here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
MONGODB_URI=your-mongodb-connection-string
NODE_ENV=production
```

**Important:** 
- Replace `your-app-name.onrender.com` with your actual Render URL (you'll get this after creating the service).
- Use your actual credentials from `.env.local`

### 4. Update Google Cloud Console

After deployment, get your Render URL (e.g., `https://charactermatch.onrender.com`), then:

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized JavaScript origins**, add:
   ```
   https://charactermatch.onrender.com
   ```
   Keep existing:
   ```
   http://localhost:3000
   http://localhost:3001
   ```

4. Under **Authorized redirect URIs**, add:
   ```
   https://charactermatch.onrender.com/api/auth/callback/google
   ```
   Keep existing:
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   ```

5. Click **Save**

### 5. Deploy and Test

1. Click **"Create Web Service"** on Render
2. Wait for deployment (5-10 minutes)
3. Once deployed, visit your app URL
4. Test the Google Sign-In with your account
5. Ask friends to test - they should be able to sign in without errors!

## How Multiple Users Can Sign In

With this setup:
- ✅ **You** can sign in (creator)
- ✅ **Anyone** with a Google account can sign in
- ✅ Works on **localhost** for development
- ✅ Works on **Render.com** for production
- ✅ All users share the same MongoDB database

### Why This Works:
- Your Google OAuth app is in **testing or production mode**
- The redirect URIs include your Render.com domain
- Any Google user can authenticate through your app
- No special permissions needed for new users

## Testing with Multiple Users

1. **Test yourself first** - Sign in from Render URL
2. **Share the link** - Send to friends: `https://your-app.onrender.com`
3. **They sign in** - They use their own Google accounts
4. **Check database** - New users appear in MongoDB Atlas

## Common Issues and Fixes

### Issue: "redirect_uri_mismatch" Error
**Solution:** 
- Verify the redirect URI in Google Console matches exactly
- Wait 30-60 seconds after adding URIs
- Clear browser cache or use incognito mode

### Issue: Users Can't Sign In
**Check:**
1. Is `NEXTAUTH_URL` set correctly on Render?
2. Did you add the Render URL to Google Console?
3. Did you click "Save" in Google Console?
4. Is MongoDB accessible from Render? (check IP whitelist)

### Issue: App Shows "Internal Server Error"
**Debug:**
1. Check Render logs: Dashboard → Your Service → Logs
2. Verify all environment variables are set
3. Check MongoDB connection string is correct
4. Ensure `NEXTAUTH_SECRET` is set

## MongoDB Atlas Network Access

Make sure MongoDB allows connections from anywhere (for Render):

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster
3. Click **Network Access** (left sidebar)
4. Click **Add IP Address**
5. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Click **Confirm**

**Note:** This is required because Render uses dynamic IPs.

## Updating Your App

When you make changes:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Render will automatically redeploy! ✨

## Security Notes

1. **Keep secrets safe:** Never commit `.env.local` to Git
2. **Use strong secrets:** Generate new `NEXTAUTH_SECRET` for production
3. **Monitor usage:** Check Google Cloud Console for OAuth usage
4. **Database security:** Use strong MongoDB passwords
5. **Rate limiting:** Consider adding rate limits for API routes

## Cost Breakdown

- **Render Free Tier:** Free (with limitations)
- **MongoDB Atlas:** Free (512MB storage)
- **Google OAuth:** Free (unlimited users)
- **Total Cost:** $0 for testing! 🎉

For production with better performance:
- Render Starter: $7/month
- MongoDB Atlas: $9+/month for dedicated clusters

---

## Quick Checklist Before Deployment

- [ ] Code pushed to GitHub
- [ ] Render web service created
- [ ] All environment variables added on Render
- [ ] Google Console OAuth URIs updated
- [ ] MongoDB network access allows Render IPs
- [ ] `NEXTAUTH_URL` points to Render domain
- [ ] Test sign-in from Render URL
- [ ] Test with a friend's account

Once all checked, your app is ready for the world! 🚀
