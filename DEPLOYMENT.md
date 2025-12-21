# Deployment Guide - Epitome Kia

This guide covers deploying the Epitome Kia dealership website to Railway with automated CI/CD.

## Quick Start (First-Time Setup)

### Prerequisites
- GitHub account (repo already connected)
- Railway account ([railway.app](https://railway.app))
- Resend account for emails ([resend.com](https://resend.com))
- Domain name (optional, Railway provides free subdomain)

### Step 1: Create Railway Project (5 minutes)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select `gopalshivapuja/epitome-kia`
4. Railway auto-detects Next.js and creates the service

### Step 2: Add PostgreSQL Database (2 minutes)

1. In your Railway project, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Railway automatically creates and connects the database
3. The `DATABASE_URL` is auto-injected into your app

### Step 3: Set Environment Variables (5 minutes)

In Railway dashboard → Your service → **Variables** tab, add:

```bash
# Required
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-app.railway.app

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Optional
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Deploy (Automatic)

Push to `main` branch → Railway automatically builds and deploys.

```bash
git push origin main
```

### Step 5: Run Database Migrations & Seed (One-time)

In Railway dashboard → Your service → **Settings** → **Deploy**:

Or use Railway CLI:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Run migrations
railway run npx prisma migrate deploy

# Seed initial data (car models, admin users)
railway run npx prisma db seed
```

### Step 6: Configure Custom Domain (Optional, 5 minutes)

1. Railway dashboard → Your service → **Settings** → **Domains**
2. Add your domain (e.g., `epitomekia.com`)
3. Add DNS records as shown:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `<your-app>.railway.app`

---

## Automated Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Developer pushes to main (or merges PR)                        │
│                     │                                           │
│                     ▼                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  GitHub Actions                          │   │
│  │  • Lint code                                             │   │
│  │  • Type check                                            │   │
│  │  • Run tests                                             │   │
│  │  • Build Next.js                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                     │                                           │
│                     ▼ (on success)                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Railway                               │   │
│  │  • Pull latest code                                      │   │
│  │  • Install dependencies                                  │   │
│  │  • Run prisma migrate deploy                             │   │
│  │  • Build production bundle                               │   │
│  │  • Deploy to production                                  │   │
│  │  • Health check                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                     │                                           │
│                     ▼                                           │
│              Live in ~2-3 minutes                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Adding New Features

### Workflow

1. **Request feature** → Claude Code implements it
2. **Review PR** → Check changes on GitHub
3. **Merge PR** → Automatic deployment to production

### Database Schema Changes

When Prisma schema changes:

```bash
# Claude Code runs locally:
npx prisma migrate dev --name descriptive_name

# On deploy, Railway automatically runs:
npx prisma migrate deploy
```

**Zero manual intervention required.**

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Auto-set by Railway |
| `NEXTAUTH_SECRET` | Session encryption key | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL for auth callbacks | `https://epitomekia.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `RESEND_API_KEY` | Email service API key | - |
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |

---

## Monitoring & Logs

### Railway Dashboard
- **Metrics**: CPU, Memory, Network
- **Logs**: Real-time application logs
- **Deployments**: History with rollback option

### Health Check
```
GET /api/health
Response: { "status": "ok", "timestamp": "..." }
```

### Error Tracking (Optional)
Add Sentry for error tracking:
```bash
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## Rollback

If a deployment causes issues:

1. Railway dashboard → **Deployments** tab
2. Find the last working deployment
3. Click **"Redeploy"**

Or via CLI:
```bash
railway rollback
```

---

## Cost Breakdown

| Service | Free Tier | Paid Estimate |
|---------|-----------|---------------|
| Railway (App) | $5 credit/month | ~$5-10/month |
| Railway (PostgreSQL) | Included | ~$5-10/month |
| Resend (Email) | 3,000/month | $0 (free tier) |
| Cloudflare (CDN/Domain) | Free | $0 |
| **Total** | | **~$10-20/month** |

---

## Troubleshooting

### Build Fails
```bash
# Check build logs in Railway dashboard
# Common fixes:
npm ci                     # Clean install
npx prisma generate        # Regenerate client
```

### Database Connection Issues
```bash
# Verify DATABASE_URL is set
railway variables

# Test connection
railway run npx prisma db pull
```

### Deployment Stuck
1. Check Railway logs for errors
2. Verify health check endpoint works
3. Try manual redeploy

---

## Security Checklist

- [ ] NEXTAUTH_SECRET is set and secure
- [ ] DATABASE_URL is not exposed in client code
- [ ] HTTPS is enabled (automatic on Railway)
- [ ] Admin passwords are changed from defaults
- [ ] Rate limiting is configured for API routes

---

## File Structure for Deployment

```
epitome-kia/
├── railway.toml              # Railway configuration
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions CI/CD
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Migration files
│   └── seed.ts               # Seed data
├── .env.example              # Environment template
└── package.json              # Scripts for deployment
```
