# TaxWise AI - Complete Setup Guide

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites
- **Node.js 18+** or **Bun** (recommended)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)
- **Supabase Account** (free tier available)

### 2. Installation
```bash
# Clone and navigate to project
git clone <repository-url>
cd wealthmate-ai-main

# Install dependencies
bun install
# OR: npm install

# Start development server
bun run dev
# OR: npm run dev
```

### 3. Access the Application
- Open your browser to `http://localhost:8080`
- Click "Get Started (Demo)" to begin
- Complete the onboarding flow
- Explore all features!

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `taxwise-ai`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

### 2. Configure Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `database-schema.sql`
3. Paste into the SQL editor
4. Click **Run** to execute the schema
5. Verify tables are created in **Table Editor**

### 3. Set Up Authentication
1. Go to **Authentication** → **Settings**
2. Configure **Site URL**: `http://localhost:8080`
3. Add **Redirect URLs**: `http://localhost:8080/**`
4. Enable **Email** provider
5. (Optional) Enable **Google** or **GitHub** providers

### 4. Configure File Storage
1. Go to **Storage** → **Buckets**
2. Create new bucket: `documents`
3. Set **Public**: `false` (private bucket)
4. Create bucket: `avatars`
5. Set **Public**: `true` (public bucket)

## 🔧 Environment Configuration

### 1. Create Environment File
```bash
# Copy the example file
cp env.example .env.local
```

### 2. Configure Variables
Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME=TaxWise AI
VITE_APP_VERSION=1.0.0

# Optional: AI Services
VITE_OPENAI_API_KEY=your-openai-key
VITE_OCR_API_KEY=your-ocr-key

# Optional: SMS/Email Services
VITE_TWILIO_ACCOUNT_SID=your-twilio-sid
VITE_TWILIO_AUTH_TOKEN=your-twilio-token
VITE_SENDGRID_API_KEY=your-sendgrid-key
```

### 3. Get Supabase Credentials
1. Go to **Settings** → **API**
2. Copy **Project URL** → `VITE_SUPABASE_URL`
3. Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 🎯 Feature Configuration

### 1. Enable Row Level Security (RLS)
The database schema automatically sets up RLS policies. Verify in Supabase:
- Go to **Authentication** → **Policies**
- Ensure all tables have RLS enabled
- Check that policies are created correctly

### 2. Configure Storage Policies
```sql
-- Allow users to upload their own documents
CREATE POLICY "Users can upload own documents" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own documents
CREATE POLICY "Users can view own documents" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. Set Up Real-time Subscriptions
```sql
-- Enable real-time for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable real-time for AI chats
ALTER PUBLICATION supabase_realtime ADD TABLE ai_chats;
```

## 🚀 Production Deployment

### 1. Build for Production
```bash
# Create production build
bun run build

# Preview production build
bun run preview
```

### 2. Deploy to Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Configure environment variables in Vercel dashboard
4. Deploy!

### 3. Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `dist`
4. Configure environment variables
5. Deploy!

### 4. Deploy to AWS/GCP/Azure
- Use the built files in `dist/` directory
- Configure your web server (Nginx, Apache)
- Set up SSL certificates
- Configure environment variables

## 🔒 Security Checklist

### 1. Environment Security
- [ ] Never commit `.env.local` to version control
- [ ] Use strong, unique passwords
- [ ] Rotate API keys regularly
- [ ] Enable 2FA on all accounts

### 2. Database Security
- [ ] Enable RLS on all tables
- [ ] Review and test RLS policies
- [ ] Set up database backups
- [ ] Monitor database access logs

### 3. Application Security
- [ ] Enable HTTPS in production
- [ ] Set up Content Security Policy
- [ ] Implement rate limiting
- [ ] Regular security audits

## 📊 Monitoring & Analytics

### 1. Supabase Monitoring
- Monitor database performance in Supabase dashboard
- Set up alerts for high usage
- Review authentication logs
- Monitor storage usage

### 2. Application Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor performance metrics
- Track user analytics
- Set up uptime monitoring

### 3. Business Metrics
- Track user registrations
- Monitor feature adoption
- Measure user engagement
- Analyze conversion rates

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm package-lock.json
bun install
```

#### 2. Supabase connection issues
- Verify environment variables are correct
- Check Supabase project is active
- Ensure RLS policies are properly configured
- Verify API keys have correct permissions

#### 3. Build errors
```bash
# Clear build cache
rm -rf dist
bun run build
```

#### 4. TypeScript errors
```bash
# Check TypeScript configuration
bun run type-check
# OR
npx tsc --noEmit
```

### Getting Help
1. Check the **ENHANCED_FEATURES.md** for feature documentation
2. Review Supabase documentation
3. Check GitHub issues
4. Contact support team

## 🎉 Success!

Once everything is set up, you should have:

✅ **Fully functional TaxWise AI application**
✅ **Multi-step onboarding flow**
✅ **AI-powered chatbot**
✅ **Notifications center**
✅ **Document upload and processing**
✅ **KYC verification system**
✅ **Responsive mobile-first design**
✅ **Real-time data synchronization**
✅ **Secure user authentication**
✅ **Production-ready deployment**

## 🚀 Next Steps

1. **Customize the branding** - Update colors, logos, and text
2. **Add your AI services** - Integrate OpenAI, OCR, etc.
3. **Configure notifications** - Set up email/SMS services
4. **Add more features** - Implement remaining roadmap items
5. **Scale your infrastructure** - Optimize for your user base

**Welcome to TaxWise AI! 🎉💰**
