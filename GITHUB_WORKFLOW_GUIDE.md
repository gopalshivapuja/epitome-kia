# GitHub Workflow & CI/CD Guide for Epitome Kia

> 📅 **Created**: December 22, 2024  
> 🎯 **Purpose**: Professional Git workflow with CI/CD for safe deployments  
> ⏱️ **Implementation Time**: ~30 minutes

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Railway Environment Setup](#railway-environment-setup)
4. [GitHub Branch Strategy](#github-branch-strategy)
5. [CI/CD Pipeline Files](#cicd-pipeline-files)
6. [Branch Protection Rules](#branch-protection-rules)
7. [Daily Development Workflow](#daily-development-workflow)
8. [Git Commands Reference](#git-commands-reference)
9. [Commit Message Convention](#commit-message-convention)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### What We're Setting Up

| Component | Purpose |
|-----------|---------|
| **GitHub Branches** | `main` (production), `develop` (testing), `feature/*` (new work) |
| **Railway Environments** | Production (live site), Development (testing) |
| **GitHub Actions CI** | Automated quality checks on every push |
| **Branch Protection** | Prevent broken code from reaching production |

### Benefits

- ✅ **Safety**: Code is tested before going live
- ✅ **Quality**: Automated linting and type checking
- ✅ **Traceability**: Clear history of what changed and why
- ✅ **Rollback**: Easy to revert if something breaks
- ✅ **Collaboration**: Ready for team expansion

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE CI/CD ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LOCAL DEVELOPMENT                                                           │
│  ─────────────────                                                           │
│  Your Computer                                                               │
│      │                                                                       │
│      │ git push                                                              │
│      ▼                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         GITHUB                                       │    │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │    │
│  │  │ feature/xyz  │───▶│   develop    │───▶│    main      │          │    │
│  │  │   branch     │ PR │   branch     │ PR │   branch     │          │    │
│  │  └──────────────┘    └──────────────┘    └──────────────┘          │    │
│  │         │                   │                   │                   │    │
│  │         │                   │                   │                   │    │
│  │         ▼                   ▼                   ▼                   │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │                   GITHUB ACTIONS                             │   │    │
│  │  │  • Run ESLint (code style)                                  │   │    │
│  │  │  • Run TypeScript check (type safety)                       │   │    │
│  │  │  • Run build (compilation)                                  │   │    │
│  │  │  • Run tests (when added)                                   │   │    │
│  │  │                                                              │   │    │
│  │  │  ❌ If any fail → Block merge, notify developer             │   │    │
│  │  │  ✅ If all pass → Allow merge                               │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    │ Webhook trigger                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         RAILWAY                                      │    │
│  │                                                                      │    │
│  │   develop branch                      main branch                    │    │
│  │        │                                   │                         │    │
│  │        ▼                                   ▼                         │    │
│  │  ┌──────────────────┐            ┌──────────────────┐               │    │
│  │  │   DEVELOPMENT    │            │   PRODUCTION     │               │    │
│  │  │   Environment    │            │   Environment    │               │    │
│  │  │                  │            │                  │               │    │
│  │  │  • Test database │            │  • Live database │               │    │
│  │  │  • Test URL      │            │  • epitomekia.com│               │    │
│  │  │  • Safe to break │            │  • Must be stable│               │    │
│  │  └──────────────────┘            └──────────────────┘               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Railway Environment Setup

### Current State
- ✅ Development environment exists (linked to `main` currently)
- ❌ Production environment not yet created
- ❌ Branch triggers not configured

### Step 1: Create Production Environment

1. Go to [Railway Dashboard](https://railway.app) → Your project (**motivated-clarity**)
2. Click the **environment dropdown** (top right, shows "Development")
3. Click **"+ New Environment"**
4. Name it: **Production**
5. Railway will clone your Development setup

### Step 2: Set Up Production Database

In the new Production environment:
1. Click **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Link the DATABASE_URL to your epitome-kia service (same as you did for Development)

### Step 3: Configure Production Variables

Go to **epitome-kia** service → **Variables** tab in Production environment:

```env
# Required for Production
DATABASE_URL=<auto-linked from PostgreSQL>
NEXTAUTH_SECRET=<generate new one: openssl rand -base64 32>
NEXTAUTH_URL=https://epitomekia.com

# Optional
RESEND_API_KEY=<your-key>
NEXT_PUBLIC_GA_ID=<your-ga-id>
```

### Step 4: Configure Branch Triggers

For **Development** environment:
1. Go to **epitome-kia** service → **Settings** → **Source**
2. Set **Branch**: `develop`

For **Production** environment:
1. Go to **epitome-kia** service → **Settings** → **Source**
2. Set **Branch**: `main`

### Step 5: Configure Domain

**Development**: Use Railway-generated domain or `dev.epitomekia.com`
**Production**: Use `epitomekia.com`

---

## GitHub Branch Strategy

### Branch Types

| Branch | Purpose | Deploys To | Protected |
|--------|---------|------------|-----------|
| `main` | Production-ready code | Production | Yes |
| `develop` | Integration branch for testing | Development | Yes |
| `feature/*` | New features | - | No |
| `bugfix/*` | Bug fixes | - | No |
| `hotfix/*` | Urgent production fixes | - | No |

### Branch Naming Convention

```
feature/ai-chatbot           # New feature
feature/360-vehicle-viewer   # New feature
bugfix/login-redirect        # Bug fix
hotfix/critical-security     # Urgent fix
chore/update-dependencies    # Maintenance
docs/api-documentation       # Documentation
```

### Creating the Develop Branch

Run these commands in your terminal:

```bash
cd /Users/gopal/Cursor/epitome-kia

# Create develop branch from main
git checkout main
git pull origin main
git checkout -b develop
git push -u origin develop
```

---

## CI/CD Pipeline Files

### File 1: `.github/workflows/ci.yml`

Create this file at `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  # Build-time environment variables (not real credentials)
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db"
  NEXTAUTH_SECRET: "ci-build-secret-not-used-in-production"
  NEXTAUTH_URL: "http://localhost:3000"

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate Prisma Client
        run: npx prisma generate
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run Type Check
        run: npm run type-check
      
      - name: Build Application
        run: npm run build

  # Uncomment when you add tests
  # test:
  #   name: Run Tests
  #   runs-on: ubuntu-latest
  #   needs: quality
  #   
  #   steps:
  #     - name: Checkout code
  #       uses: actions/checkout@v4
  #     
  #     - name: Setup Node.js
  #       uses: actions/setup-node@v4
  #       with:
  #         node-version: '20'
  #         cache: 'npm'
  #     
  #     - name: Install dependencies
  #       run: npm ci
  #     
  #     - name: Generate Prisma Client
  #       run: npx prisma generate
  #     
  #     - name: Run Tests
  #       run: npm test
```

### File 2: `.github/workflows/deploy-check.yml`

Create this file at `.github/workflows/deploy-check.yml`:

```yaml
name: Production Deploy Check

on:
  pull_request:
    branches: [main]

env:
  DATABASE_URL: "postgresql://user:pass@localhost:5432/db"
  NEXTAUTH_SECRET: "ci-build-secret-not-used-in-production"
  NEXTAUTH_URL: "http://localhost:3000"

jobs:
  deploy-check:
    name: Pre-Production Verification
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate Prisma Client
        run: npx prisma generate
      
      - name: Run Full Deploy Check
        run: npm run deploy:check
      
      - name: Success Comment
        if: success()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ **All quality checks passed!**\n\nThis PR is ready for production deployment.\n\n- ✓ Linting\n- ✓ Type checking\n- ✓ Build successful'
            })
```

### File 3: `.github/pull_request_template.md`

Create this file at `.github/pull_request_template.md`:

```markdown
## 📝 Description
<!-- What does this PR do? Why is it needed? -->

## 🏷️ Type of Change
- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 📝 Documentation update
- [ ] ♻️ Code refactor (no functional changes)
- [ ] 🔧 Configuration change
- [ ] 🎨 Style/UI update

## 🧪 Testing
- [ ] Tested locally with `npm run dev`
- [ ] Tested on Development environment (Railway)
- [ ] No console errors
- [ ] Mobile responsive (if UI change)

## ✅ Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] New and existing tests pass locally

## 📸 Screenshots (if applicable)
<!-- Add screenshots for UI changes -->

## 🔗 Related Issues
<!-- Link any related issues: Fixes #123, Relates to #456 -->
```

### File 4: `.github/CODEOWNERS`

Create this file at `.github/CODEOWNERS`:

```
# Default owner for everything in the repo
* @gopalshivapuja

# Database schema changes require extra attention
/prisma/ @gopalshivapuja

# Admin functionality
/src/app/admin/ @gopalshivapuja

# API routes
/src/app/api/ @gopalshivapuja

# Authentication
/src/lib/auth.ts @gopalshivapuja
```

---

## Branch Protection Rules

### Setting Up Protection on GitHub

Go to: **GitHub** → **Your repo** → **Settings** → **Branches** → **Add branch protection rule**

### Rules for `main` Branch

**Branch name pattern**: `main`

```
☑️ Require a pull request before merging
   ☑️ Require approvals: 1 (set to 0 if working solo)
   ☑️ Dismiss stale pull request approvals when new commits are pushed
   
☑️ Require status checks to pass before merging
   ☑️ Require branches to be up to date before merging
   Search and select: "Code Quality"
   
☑️ Require conversation resolution before merging

☐ Require signed commits (optional, advanced)

☐ Require linear history (optional)

☑️ Do not allow bypassing the above settings

☐ Allow force pushes (keep unchecked!)

☐ Allow deletions (keep unchecked!)
```

### Rules for `develop` Branch

**Branch name pattern**: `develop`

```
☑️ Require a pull request before merging

☑️ Require status checks to pass before merging
   Search and select: "Code Quality"

☐ Do not allow bypassing the above settings (optional for develop)
```

---

## Daily Development Workflow

### Starting a New Feature

```bash
# 1. Make sure you're on develop and it's up to date
git checkout develop
git pull origin develop

# 2. Create a new feature branch
git checkout -b feature/your-feature-name

# 3. Start development server
npm run dev
```

### While Developing

```bash
# Make changes, then stage and commit
git add .
git commit -m "feat: add initial chatbot component"

# Push to remote (first time)
git push -u origin feature/your-feature-name

# Push subsequent changes
git push
```

### Creating a Pull Request (Feature → Develop)

1. Go to GitHub → Your repo
2. You'll see "Compare & pull request" button
3. Set:
   - Base: `develop`
   - Compare: `feature/your-feature-name`
4. Fill out the PR template
5. Click "Create pull request"
6. Wait for CI checks to pass ✅
7. Merge the PR

### Promoting to Production (Develop → Main)

1. Test thoroughly on Development environment
2. Create PR:
   - Base: `main`
   - Compare: `develop`
3. Wait for deploy-check to pass
4. Review changes one more time
5. Merge to main
6. Railway auto-deploys to Production! 🚀

### Keeping Your Branch Updated

```bash
# If develop has new changes you need
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git merge develop

# Resolve any conflicts if they occur
# Then continue working
```

---

## Git Commands Reference

### Essential Commands

```bash
# Check current branch and status
git status
git branch

# Switch branches
git checkout branch-name
git checkout -b new-branch-name  # Create and switch

# Stage changes
git add .                    # Stage all changes
git add path/to/file         # Stage specific file

# Commit
git commit -m "type: description"

# Push
git push                     # Push current branch
git push -u origin branch    # First push of new branch

# Pull latest changes
git pull                     # Pull current branch
git pull origin branch-name  # Pull specific branch

# View history
git log --oneline -10        # Last 10 commits
git log --graph --oneline    # Visual branch history

# Undo changes
git checkout -- file         # Discard file changes
git reset HEAD~1             # Undo last commit (keep changes)
git reset --hard HEAD~1      # Undo last commit (discard changes)

# Clean up merged branches
git branch -d branch-name    # Delete local branch
git push origin --delete branch-name  # Delete remote branch
```

### Useful Aliases (Optional)

Add to your `~/.gitconfig`:

```ini
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    lg = log --oneline --graph --decorate -10
    undo = reset HEAD~1
    amend = commit --amend --no-edit
```

---

## Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/) standard:

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add AI chatbot component` |
| `fix` | Bug fix | `fix: resolve login redirect issue` |
| `docs` | Documentation | `docs: update API documentation` |
| `style` | Formatting (no code change) | `style: format with prettier` |
| `refactor` | Code restructuring | `refactor: simplify EMI calculation` |
| `test` | Adding tests | `test: add validation unit tests` |
| `chore` | Maintenance | `chore: update dependencies` |
| `perf` | Performance | `perf: optimize image loading` |
| `ci` | CI/CD changes | `ci: add type-check to workflow` |

### Examples

```bash
# Feature
git commit -m "feat(chatbot): add voice input support"

# Bug fix
git commit -m "fix(auth): resolve session expiry redirect"

# With scope
git commit -m "feat(admin): add bulk lead export"

# Breaking change
git commit -m "feat!: change API response format

BREAKING CHANGE: API now returns data in {data, meta} format"
```

---

## Troubleshooting

### CI Failing on GitHub

1. **Check the Actions tab** on GitHub to see error details
2. Common issues:
   - **Lint errors**: Run `npm run lint` locally and fix
   - **Type errors**: Run `npm run type-check` locally and fix
   - **Build errors**: Run `npm run build` locally and fix

### Railway Not Deploying

1. Check Railway dashboard for build logs
2. Verify branch trigger is set correctly
3. Check if GitHub webhook is connected

### Merge Conflicts

```bash
# When you get conflicts
git status  # See conflicted files

# Open files and resolve conflicts (look for <<<<< markers)
# Then:
git add .
git commit -m "fix: resolve merge conflicts"
```

### Need to Revert a Bad Deploy

```bash
# On main branch
git revert HEAD  # Creates a new commit that undoes the last one
git push

# Railway will auto-deploy the revert
```

### Database Differences Between Environments

```bash
# Push schema to specific database
DATABASE_URL="your-dev-url" npx prisma db push
DATABASE_URL="your-prod-url" npx prisma db push

# Seed specific database
DATABASE_URL="your-dev-url" npx prisma db seed
```

---

## Implementation Checklist

Use this checklist when implementing:

### GitHub Setup
- [ ] Create `develop` branch
- [ ] Create `.github/workflows/ci.yml`
- [ ] Create `.github/workflows/deploy-check.yml`
- [ ] Create `.github/pull_request_template.md`
- [ ] Create `.github/CODEOWNERS`
- [ ] Set up branch protection for `main`
- [ ] Set up branch protection for `develop`

### Railway Setup
- [ ] Create Production environment
- [ ] Add PostgreSQL to Production
- [ ] Configure Production environment variables
- [ ] Set Development branch trigger to `develop`
- [ ] Set Production branch trigger to `main`
- [ ] Configure Production domain (`epitomekia.com`)
- [ ] Configure Development domain

### DNS Setup (GoDaddy)
- [ ] Update DNS records for `epitomekia.com` to point to Railway Production
- [ ] Optionally set up `dev.epitomekia.com` for Development

### Test the Flow
- [ ] Create a test feature branch
- [ ] Make a small change
- [ ] Push and create PR to `develop`
- [ ] Verify CI runs
- [ ] Merge and verify Development deployment
- [ ] Create PR from `develop` to `main`
- [ ] Verify deploy-check runs
- [ ] Merge and verify Production deployment

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    QUICK REFERENCE                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  START NEW FEATURE                                           │
│  git checkout develop && git pull                            │
│  git checkout -b feature/name                                │
│                                                              │
│  SAVE WORK                                                   │
│  git add . && git commit -m "type: description"              │
│  git push                                                    │
│                                                              │
│  DEPLOY TO DEV                                               │
│  Create PR: feature → develop                                │
│  Merge after CI passes                                       │
│                                                              │
│  DEPLOY TO PROD                                              │
│  Create PR: develop → main                                   │
│  Merge after testing on Dev                                  │
│                                                              │
│  COMMIT TYPES                                                │
│  feat | fix | docs | style | refactor | test | chore        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Next Steps After Implementation

Once this is set up, you can:

1. **Add automated testing** (Jest, Playwright)
2. **Add code coverage reporting** 
3. **Add Slack/Discord notifications** for deployments
4. **Add preview deployments** for PRs
5. **Add database migration automation**
6. **Add security scanning** (Dependabot, CodeQL)

---

*Happy coding! 🚀*

*Remember: The goal is to make deployments boring - no surprises, no stress.*

