# 🚀 Supabase Cloud Database Setup Guide

## 🎯 **Step-by-Step Setup for Akio Comic Website**

### **Step 1: Create Supabase Project**

1. **Go to Supabase Dashboard**
   - Visit: [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Organization: Choose or create one
   - Project name: `akio-comic-website`
   - Database password: Create a strong password
   - Region: Choose closest to your users
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll see "Project is ready" message

### **Step 2: Get Your API Keys**

1. **Go to Settings > API**
   - Copy `Project URL`
   - Copy `anon public` key
   - These go in `supabase-config.js`

### **Step 3: Create Database Tables**

1. **Go to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New query"

2. **Create Comics Table**
```sql
CREATE TABLE comics (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT NOT NULL,
    thumbnail TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. **Create Ads Table**
```sql
CREATE TABLE ads (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. **Create Users Table**
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    join_date TEXT,
    status TEXT DEFAULT 'active',
    type TEXT DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. **Create Statistics Table**
```sql
CREATE TABLE statistics (
    id TEXT PRIMARY KEY,
    total_users INTEGER DEFAULT 0,
    daily_views INTEGER DEFAULT 0,
    online_users INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Step 4: Enable Storage**

1. **Go to Storage**
   - Click "Storage" in left sidebar
   - Click "Create a new bucket"
   - Name: `images`
   - Public bucket: `Yes`
   - Click "Create bucket"

2. **Set Storage Policies**
   - Go to "Policies" tab
   - Click "New Policy"
   - Choose "Create a policy from template"
   - Select "Allow public access to any authenticated user"
   - Click "Review"
   - Click "Save policy"

### **Step 5: Update Configuration**

1. **Edit `supabase-config.js`**
```javascript
const SUPABASE_URL = 'YOUR_ACTUAL_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_ACTUAL_ANON_KEY';
```

### **Step 6: Test Database Connection**

1. **Open Website**
   - Load your website in browser
   - Check browser console for Supabase messages
   - Should see "Supabase connected successfully"

2. **Test Upload**
   - Go to admin panel
   - Try uploading a comic or ad
   - Check Supabase dashboard for new records

## 📊 **Database Structure**

### **Tables Created:**

#### **1. Comics Table**
- `id` - Auto-incrementing primary key
- `title` - Comic title
- `description` - Comic description
- `link` - Telegram or other link
- `thumbnail` - Image URL
- `views` - View count
- `likes` - Like count
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

#### **2. Ads Table**
- `id` - Auto-incrementing primary key
- `title` - Ad title
- `link` - Ad link
- `image` - Ad image URL
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

#### **3. Users Table**
- `id` - Auto-incrementing primary key
- `username` - Unique username
- `join_date` - Join date
- `status` - Active/inactive
- `type` - Premium/normal
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

#### **4. Statistics Table**
- `id` - Statistics identifier
- `total_users` - Total user count
- `daily_views` - Daily view count
- `online_users` - Online user count
- `updated_at` - Last update timestamp

## 🔒 **Security & Policies**

### **Row Level Security (RLS)**
```sql
-- Enable RLS on all tables
ALTER TABLE comics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON comics FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON ads FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON statistics FOR SELECT USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Allow authenticated insert" ON comics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON comics FOR UPDATE USING (true);
```

## 💰 **Free Tier Benefits**

- **Database**: 500MB storage
- **Storage**: 50MB file storage
- **Bandwidth**: 2GB transfer/month
- **API Calls**: 50,000 requests/month
- **Real-time**: Unlimited connections
- **Perfect for**: Small to medium websites

## 🎯 **Next Steps**

1. **Test Basic Functions**
   - Upload comics and ads
   - Check real-time updates
   - Verify data persistence

2. **Add Authentication**
   - User login system
   - Admin role management
   - Secure admin panel

3. **Production Deployment**
   - Set proper RLS policies
   - Enable authentication
   - Monitor usage

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"Supabase not initialized"**
   - Check `supabase-config.js` values
   - Verify Supabase SDK loading

2. **"Permission denied"**
   - Check RLS policies
   - Verify table permissions

3. **"Image upload failed"**
   - Check Storage bucket policies
   - Verify file size limits

### **Get Help:**
- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Community Support: [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

---

**🎉 Congratulations! Your website now has a powerful PostgreSQL database!**

Supabase gives you enterprise-grade database features with a generous free tier. 