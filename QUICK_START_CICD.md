# 🚀 Quick Start: CI/CD Cheat Sheet

## Your Daily Workflow

### Starting a New Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
# ... code code code ...
git add .
git commit -m "feat: description of what you built"
git push origin feature/your-feature-name
```

### Creating a Pull Request
1. Go to GitHub repo
2. Click "Compare & pull request"
3. Base: `develop` ← Compare: `feature/your-feature-name`
4. Fill out the auto-populated template
5. Wait for ✅ CI checks to pass
6. Merge!

### Deploying to Production
1. Make sure `develop` is fully tested
2. Create PR: `main` ← `develop`
3. Wait for ✅ all checks + deploy check
4. Review changes carefully
5. Merge → Railway auto-deploys to production! 🎉

---

## What Happens When You Push?

```
YOU PUSH CODE
    ↓
GITHUB ACTIONS RUNS
    ├─ Lint ✅
    ├─ Type Check ✅
    ├─ Tests ✅
    └─ Build ✅
    ↓
CI PASSES ✅
    ↓
MERGE TO DEVELOP
    ↓
RAILWAY DEPLOYS TO DEV 🧪
    ↓
TEST ON DEV ENVIRONMENT
    ↓
MERGE TO MAIN
    ↓
RAILWAY DEPLOYS TO PROD 🚀
    ↓
LIVE ON epitomekia.com! 🎉
```

---

## Useful Commands

```bash
# Check which branch you're on
git branch

# See what changed
git status

# Pull latest changes
git pull origin develop

# See recent commits
git log --oneline -10

# Run same checks as CI locally
npm run lint
npm run type-check
npm run build
npm run test:run
npm run deploy:check  # All of the above!

# Check if Railway is happy
curl https://epitomekia.com/api/health
```

---

## Commit Message Format

```bash
feat: add new feature
fix: resolve bug
docs: update docs
style: format code
refactor: restructure
test: add tests
chore: maintenance
ci: update workflows
```

---

## Branch Naming

```bash
feature/ai-chatbot          # New features
bugfix/login-issue          # Bug fixes
hotfix/critical-error       # Urgent production fixes
docs/update-readme          # Documentation
test/add-unit-tests         # Testing
chore/update-deps           # Maintenance
```

---

## GitHub URLs

- **Actions**: `https://github.com/gopalshivapuja/epitome-kia/actions`
- **Pull Requests**: `https://github.com/gopalshivapuja/epitome-kia/pulls`
- **Settings**: `https://github.com/gopalshivapuja/epitome-kia/settings`

---

## Railway URLs

- **Dashboard**: `https://railway.app`
- **Logs**: Railway → Your Project → Your Service → Logs
- **Deployments**: Railway → Your Project → Deployments

---

## Emergency: Something Broke in Production!

```bash
# Option 1: Quick fix
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix
# ... fix the issue ...
git add .
git commit -m "fix: resolve critical production issue"
git push origin hotfix/critical-fix
# Create PR to main immediately!

# Option 2: Revert in Railway
# Go to Railway → Deployments → Find last working version → Redeploy
```

---

## Pro Tips 💡

1. **Always pull before creating new branches**
   ```bash
   git pull origin develop
   ```

2. **Run checks locally before pushing**
   ```bash
   npm run deploy:check
   ```

3. **Keep PRs small** - easier to review, less likely to break

4. **Write good commit messages** - your future self will thank you

5. **Test on develop first** - never merge untested code to main

6. **Check GitHub Actions** - if CI fails, fix before merging

---

## Remember 🧠

- `develop` = Testing/Staging environment
- `main` = Production (live website)
- Never push directly to `main` (branch protection prevents this anyway!)
- CI checks must pass before merging
- Railway automatically deploys on successful merges

---

**That's it! You're now a CI/CD pro!** 🎓🚀
