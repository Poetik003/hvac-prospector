# 🚀 ProSpector Pro - Netlify Deployment Guide

## 🌐 Quick Deployment Options

### Option 1: GitHub Integration (Recommended)

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **Click "Add new site" → "Import from Git"**
3. **Connect GitHub** and authorize Netlify
4. **Select Repository**: `Poetik003/hvac-prospector`
5. **Configure Build Settings**:
   - **Branch to deploy**: `main` (or `genspark_ai_developer` for latest features)
   - **Build command**: `npm run netlify-build` (or leave empty)
   - **Publish directory**: `.` (root directory)
6. **Click "Deploy site"**

### Option 2: Netlify CLI Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to your Netlify account
netlify login

# Initialize site (run from project directory)
netlify init

# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Option 3: Manual Drag & Drop

1. **Zip the project** (exclude files listed in .netlifyignore)
2. **Go to Netlify Dashboard**
3. **Drag zip file** to deploy area
4. **Wait for deployment**

## 📋 Pre-Deployment Checklist

### ✅ Files Ready for Deployment
- `Index.html` - Main application
- `training.html` - AI Voice Training page  
- `direct-training.html` - Direct access page
- `netlify.toml` - Deployment configuration
- `package.json` - Project metadata
- `.netlifyignore` - Files to exclude

### ⚙️ Configuration Files
- **`netlify.toml`**: Handles redirects, headers, and build settings
- **`.netlifyignore`**: Excludes server files and dev tools
- **`package.json`**: Updated with Netlify-friendly scripts

### 🎯 App Features That Work on Netlify
- ✅ **Voice Training Interface** - Full functionality
- ✅ **AI Voice Customization** - Settings save to localStorage
- ✅ **Voice Preview System** - Static audio URLs work perfectly
- ✅ **Script Testing** - Fast voice selection based on settings
- ✅ **Mobile Compatibility** - Responsive design
- ✅ **Audio Debugging** - Comprehensive fallback system

## 🔧 Important Notes

### 🌐 Static vs Dynamic Features

**✅ Works on Netlify (Static)**:
- All HTML/CSS/JavaScript functionality
- Voice training interfaces
- Audio playback with static URLs
- LocalStorage settings persistence
- Client-side voice selection logic

**⚠️ Requires External Service**:
- **Flask Voice API** (`voice_api.py`) - Deploy separately on:
  - Heroku
  - Railway
  - Google Cloud Run  
  - DigitalOcean App Platform

### 🔗 API Integration

The app is configured to work with static audio URLs by default. For custom voice generation, you'll need to:

1. **Deploy Flask API** separately (see voice_api.py)
2. **Update API endpoint** in netlify.toml:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-flask-api-server.herokuapp.com/api/:splat"
   ```

## 🎯 Expected Netlify URL Structure

After deployment, your URLs will be:
- **Main App**: `https://your-site-name.netlify.app/`
- **Training**: `https://your-site-name.netlify.app/training.html`
- **Direct Training**: `https://your-site-name.netlify.app/direct-training.html`

## 🧪 Post-Deployment Testing

1. **Visit main app** - Should load ProSpector Pro interface
2. **Test voice training** - Navigate to training sections
3. **Try voice previews** - Should play Miami AI voices
4. **Check console** - Verify no critical errors
5. **Test mobile** - Ensure responsive design works

## 🔍 Troubleshooting

### Common Issues:
- **404 errors**: Check netlify.toml redirects
- **Audio not playing**: Browser autoplay policies (use fallback controls)
- **Slow loading**: Enable caching headers (already configured)
- **API errors**: External Flask API not connected (expected for static version)

### Debug Steps:
1. **Check Netlify deploy logs**
2. **Open browser console** for JavaScript errors
3. **Test audio with** `window.testAudioPlayback()` function
4. **Verify file paths** match case-sensitive requirements

## 🎉 Success Indicators

✅ **Deployment successful** when you can:
- Load the main ProSpector Pro interface
- Navigate to voice training sections
- Play voice previews (hear Miami AI voices)
- Save voice customization settings
- See mobile-friendly responsive design

---

**Ready to deploy your AI-powered HVAC sales training platform! 🚀**