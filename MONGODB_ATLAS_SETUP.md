# MongoDB Atlas Setup for Render Deployment

## Step-by-Step MongoDB Atlas Configuration

### 1. Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign Up"
3. Create account with email and password
4. Fill out organization details (keep defaults is fine)
5. Click "Create Organization"

---

## 2. Create a Project

1. Click "New Project"
2. Name: "ecommerce-analytics" (or your preference)
3. Click "Create Project"
4. Click "Create a Deployment"

---

## 3. Create a Cluster (Free Tier)

1. Choose **M0 FREE** tier (always free, perfect for development/small projects)
2. Provider: AWS, Google Cloud, or Azure (doesn't matter)
3. Region: Choose closest to your location (e.g., us-east-1)
4. Cluster Name: Keep default or customize
5. Click **"Create Deployment"**

Wait 3-5 minutes for cluster to deploy...

---

## 4. Create Database User

1. After cluster is created, go to **"Database Access"**
2. Click **"Add New Database User"**
3. Configure:
   - **Authentication Method**: Password
   - **Username**: `admin` (or your choice)
   - **Password**: Generate strong password (save this!)
   - **Built-in Role**: `Atlas admin`
4. Click **"Add User"**

---

## 5. Configure Network Access

1. Go to **"Network Access"**
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"**
   - This is necessary for Render (you can restrict later)
   - Enter: `0.0.0.0/0`
4. Click **"Confirm"**

---

## 6. Get Connection String

1. Go to **"Clusters"**
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select:
   - Driver: **Node.js**
   - Version: **4.x or later**
5. Copy the connection string

**Example format:**
```
mongodb+srv://admin:password@cluster0.abcd123.mongodb.net/?retryWrites=true&w=majority
```

---

## 7. Update Connection String

Replace in the copied string:
- `<password>` → Your database user password (from step 4)
- `/?retryWrites=true&w=majority` → `/dbname?retryWrites=true&w=majority`

Example:
```
mongodb+srv://admin:MyPassword123@cluster0.abcd123.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

## 8. Create Database (Optional but Recommended)

1. Go to **"Browse Collections"**
2. Click **"Create Database"**
3. **Database Name**: `ecommerce`
4. **Collection Name**: `admins` (or leave empty)
5. Click **"Create"**

---

## 9. Use Connection String in Render

1. Copy your connection string with password and dbname
2. Go to Render Dashboard → Backend Service
3. Go to **"Environment"** tab
4. Set `MONGODB_URI`:
   ```
   mongodb+srv://admin:MyPassword123@cluster0.abcd123.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
5. Click **"Deploy"**

---

## 🔒 Security Best Practices

### Username & Password
- ✅ Use strong passwords (20+ characters)
- ✅ Save securely (password manager)
- ✅ Don't share with others
- ❌ Don't use real passwords as examples

### Network Access
- ✅ For production, restrict to Render IPs only (if possible)
- ✅ For development, use 0.0.0.0/0 (anywhere)
- ✅ Monitor "Real-time Performance Panel" for suspicious activity

### Connection String
- ✅ Keep connection string in .env only
- ❌ Never commit to GitHub
- ❌ Never expose in frontend code
- ❌ Never share publicly

---

## 💡 Monitoring Your Database

### Performance Metrics
1. Go to **"Metrics"** tab in MongoDB Atlas
2. Monitor:
   - Operations per second
   - Network I/O
   - Memory usage
   - Database size

### Activity
1. Go to **"Activity"** tab
2. See all database operations
3. Monitor for slow queries

### Alerts
1. Go to **"Alert Settings"**
2. Enable:
   - Replication lag alert
   - Memory usage alert
   - Operation rate alert

---

## 📊 Database Collections Created Automatically

Your application will automatically create these collections:

```
ecommerce
├── admins          (Admin users)
├── users           (Google OAuth users)
├── products        (Products catalog)
├── offers          (Special offers)
├── clickevents     (Click tracking)
├── visitors        (Visitor tracking)
├── mlpredictions   (ML predictions)
└── sessions        (Session data)
```

---

## ✅ Test Your Connection

After setting up, test with:

```bash
# In your server directory
npm start

# Should see: "MongoDB connected: cluster0.abcd123.mongodb.net"
```

If error, check:
1. Username/password correct?
2. IP whitelist includes 0.0.0.0/0?
3. Connection string has dbname?

---

## 🆓 Free Tier Limitations

| Feature | Free Tier | Notes |
|---------|-----------|-------|
| Storage | 512 MB | Plenty for starting out |
| Monthly Ingestion | 10 GB | Tracking data limit |
| Backups | Automatic | 2-day retention |
| Users | Unlimited | Database users |
| Collections | Unlimited | But limited by storage |
| API Requests | Unlimited | No throttling |

---

## 🚀 Upgrading Later

If you need more storage or better performance:
1. Go to **"Clusters"** 
2. Click **"Upgrade"**
3. Choose M2 or higher tier
4. No data loss during upgrade

Cost starts at ~$57/month for M2, but free tier is great for starting.

---

## 🔗 Useful MongoDB Atlas Links

- **Dashboard**: https://cloud.mongodb.com/
- **Documentation**: https://docs.mongodb.com/
- **Atlas API**: https://docs.atlas.mongodb.com/api/
- **Security Best Practices**: https://docs.atlas.mongodb.com/security/

---

## 🆘 Troubleshooting

### "Authentication Failed"
**Solution**: 
- Check username/password in connection string
- Verify database user exists
- Make sure you're not using the admin password

### "Connection Timeout"
**Solution**:
- Check IP whitelist (should be 0.0.0.0/0)
- Verify network access rule exists
- Try from different network

### "Database Not Found"
**Solution**:
- Check dbname at end of connection string
- Create database if it doesn't exist
- Application will create collections automatically

### "Too many connections"
**Solution**:
- Increase connection pool limit
- Check for connection leaks in code
- Upgrade cluster tier

---

## 💾 Backup & Recovery

### Automatic Backups (Free)
- MongoDB automatically backs up every 12 hours
- Retains last 2 days of backups
- Stored in AWS S3 (your region)

### Manual Backup
1. Go to **"Backup"** tab
2. Click **"Create Backup Now"**
3. Named backup created immediately
4. Download if needed

### Restore
1. Go to **"Backup"** tab
2. Click **"Restore"** on any backup
3. Restore to new cluster or current cluster
4. Select restore options

---

## 📈 Scaling Strategy

### Phase 1: Free Tier (Development)
- 512 MB storage
- Perfect for testing
- $0/month

### Phase 2: M2 Tier (Early Production)
- 10 GB storage
- Dedicated servers
- Automatic backups (35 days)
- ~$57/month

### Phase 3: M5+ Tier (Scaling)
- 100+ GB storage
- Auto-scaling enabled
- Advanced monitoring
- ~$300+/month

---

## ✨ You're Ready!

Your MongoDB database is now ready for Render deployment.

**Next**: Go to `RENDER_QUICK_START.md` to deploy your application.

---

**MongoDB Atlas is now configured! 🎉**
