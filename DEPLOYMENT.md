# Deployment Guide — Epitome Kia

Deploy the Epitome Kia website to Railway in under 15 minutes.

---

## Quick Deploy (First Time)

### Step 1: Create Railway Project (2 min)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select `gopalshivapuja/epitome-kia`
4. Railway auto-detects Next.js

### Step 2: Add PostgreSQL (1 min)

1. In your Railway project, click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. `DATABASE_URL` is automatically injected

### Step 3: Set Environment Variables (3 min)

In Railway dashboard → Your service → **Variables** tab:

```bash
# Required
NEXTAUTH_SECRET=<generate below>
NEXTAUTH_URL=https://your-app.railway.app

# Email (get from resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxx

# Google Maps (get from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key

# Analytics (get from Google Analytics)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Deploy (Automatic)

Push to `main` → Railway builds and deploys automatically.

```bash
git push origin main
```

### Step 5: Initialize Database (2 min)

Install Railway CLI and run migrations:

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npx prisma migrate deploy

# Seed initial data (9 car models, admin user, sample offers)
railway run npx prisma db seed
```

### Step 6: Verify Deployment

1. **Health check**: `GET https://your-app.railway.app/api/health`
2. **Homepage**: Visit your Railway URL
3. **Admin login**: `/admin/login` with seeded credentials

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Auto-set by Railway PostgreSQL |
| `NEXTAUTH_SECRET` | ✅ | 32+ char secret for JWT signing |
| `NEXTAUTH_URL` | ✅ | Full URL of your app |
| `RESEND_API_KEY` | ✅ | Email notifications |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics 4 ID |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ✅ | Google Maps Embed API key |

---

## Post-Deploy Verification Checklist

Run through these after first deployment:

- [ ] Homepage loads correctly
- [ ] Model catalog shows 9 Kia models
- [ ] Test drive form submits successfully
- [ ] Service booking form works
- [ ] Contact form works
- [ ] EMI calculator functions
- [ ] Admin login works (`/admin/login`)
- [ ] Admin dashboard shows data
- [ ] WhatsApp button visible
- [ ] Health check returns 200

---

## Weekly Release Process

After initial deploy, ship new features weekly:

```
1. Create feature branch
   git checkout -b feature/chatbot

2. Develop and test locally
   npm run dev

3. Push branch (Railway creates preview)
   git push origin feature/chatbot

4. Create PR on GitHub
   - Railway auto-deploys preview URL

5. Review and merge to main
   - Railway auto-deploys to production

6. Verify in production
   - Check /api/health
   - Test new feature
```

---

## Custom Domain (Optional)

1. Railway dashboard → Your service → **Settings** → **Domains**
2. Click **"+ Custom Domain"**
3. Add your domain (e.g., `epitomekia.com`)
4. Add DNS records:

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | `your-app.railway.app` |
| CNAME | www | `your-app.railway.app` |

---

## Troubleshooting

### Build Fails

```bash
# Check build locally first
npm run build

# Common fixes
npm ci                    # Clean install
npx prisma generate       # Regenerate Prisma client
```

### Database Connection Issues

```bash
# Verify DATABASE_URL is set
railway variables

# Test connection
railway run npx prisma db pull
```

### Auth Not Working

1. Verify `NEXTAUTH_SECRET` is set (32+ chars)
2. Verify `NEXTAUTH_URL` matches your Railway URL exactly
3. Check Railway logs for auth errors

### Forms Not Sending Emails

1. Verify `RESEND_API_KEY` is valid
2. Check Railway logs for email errors
3. Verify sender domain in Resend dashboard

---

## Rollback

If a deployment causes issues:

```bash
# Via CLI
railway rollback

# Or via dashboard
# Railway → Deployments → Find last working → Redeploy
```

---

## Monitoring

### Railway Dashboard
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Deployments**: History with rollback option

### Health Check Endpoint
```bash
curl https://your-app.railway.app/api/health
# Returns: { "status": "ok", "timestamp": "..." }
```

### Viewing Logs

**Via Railway CLI:**
```bash
railway logs                  # Live logs
railway logs --tail 100       # Last 100 lines
```

**Via Dashboard:**
1. Railway → Your service → **Logs** tab
2. Filter by time range, search for errors

### Key Metrics to Monitor

| Metric | Target | Action if Exceeded |
|--------|--------|-------------------|
| Response time | < 500ms | Check database queries |
| Error rate | < 1% | Check logs for exceptions |
| Memory usage | < 512MB | Optimize or upgrade plan |
| CPU usage | < 80% | Check for infinite loops |

### Recommended Alerts

Set up alerts in Railway dashboard for:
- Deployment failures
- High memory usage (> 80%)
- Health check failures

---

## Cost Estimate

| Service | Free Tier | Paid |
|---------|-----------|------|
| Railway App | $5 credit/mo | ~$5-10/mo |
| Railway PostgreSQL | Included | ~$5-10/mo |
| Resend Email | 3,000/mo | Free tier |
| **Total** | Free to start | **~$10-20/mo** |

---

## File Reference

```
epitome-kia/
├── railway.toml              # Railway configuration
├── .github/workflows/ci.yml  # GitHub Actions (lint, typecheck)
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Migration files
│   └── seed.ts               # Seed data
├── .env.example              # Environment template
└── package.json              # Build scripts
```

---

## Security Checklist

Before going live:

- [ ] `NEXTAUTH_SECRET` is unique and secure
- [ ] Admin password changed from seed default
- [ ] `DATABASE_URL` not exposed in client code
- [ ] HTTPS enabled (automatic on Railway)
- [ ] Rate limiting active on form endpoints
- [ ] Security headers configured (CSP, X-Frame-Options)

---

## Need Help?

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
