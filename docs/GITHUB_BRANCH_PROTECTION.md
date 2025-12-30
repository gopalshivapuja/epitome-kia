# GitHub Branch Protection Setup Guide

This guide walks you through setting up branch protection rules on GitHub to ensure code quality and prevent accidental deployments.

## Prerequisites

- Repository admin access
- GitHub Actions workflows already configured (`.github/workflows/ci.yml` and `deploy-check.yml`)

## Step 1: Access Branch Protection Settings

1. Go to your GitHub repository: `https://github.com/gopalshivapuja/epitome-kia`
2. Click on **Settings** (top navigation)
3. In the left sidebar, click **Branches** (under "Code and automation")
4. Click **Add branch protection rule** (or **Add rule**)

## Step 2: Protect the `main` Branch

### Branch Name Pattern
Enter: `main`

### Protection Rules to Enable

#### ✅ Require a pull request before merging
- Check this box
- **Require approvals**: Set to `1` (or `0` if working solo for now)
- ✅ Check **Dismiss stale pull request approvals when new commits are pushed**
- ✅ Check **Require review from Code Owners** (optional)

#### ✅ Require status checks to pass before merging
- Check this box
- ✅ Check **Require branches to be up to date before merging**
- In the search box, add these status checks:
  - `Lint & Type Check`
  - `Build`
  - `Unit Tests`

> **Note**: These status checks will only appear after you've pushed code and the workflows have run at least once.

#### ✅ Require conversation resolution before merging
- Check this box (ensures all PR comments are addressed)

#### ✅ Require signed commits (Optional)
- Leave unchecked unless you're using GPG signing

#### ✅ Require linear history (Optional)
- Leave unchecked for now (prevents merge commits)

#### ✅ Include administrators
- Check **Do not allow bypassing the above settings**
- This prevents even admins from pushing directly

#### ❌ Allow force pushes
- Leave UNCHECKED (force pushes are dangerous!)

#### ❌ Allow deletions
- Leave UNCHECKED (prevents accidental branch deletion)

### Save the Rule
Click **Create** at the bottom

---

## Step 3: Protect the `develop` Branch

### Branch Name Pattern
Enter: `develop`

### Protection Rules to Enable

#### ✅ Require a pull request before merging
- Check this box
- **Require approvals**: Set to `0` (develop can be more flexible)

#### ✅ Require status checks to pass before merging
- Check this box
- In the search box, add:
  - `Lint & Type Check`
  - `Unit Tests`

#### Optional Settings
- You can be less strict with `develop` than `main`
- Don't need to check "Do not allow bypassing" for develop

### Save the Rule
Click **Create**

---

## Step 4: Verify Protection is Active

After saving, you should see:
- 🔒 Lock icon next to `main` and `develop` branches
- Attempt to push directly: `git push origin main` → Should be **blocked**
- Must create PRs to merge code

---

## Step 5: Configure Railway Environment Triggers

Now that branches are protected, ensure Railway deploys correctly:

### For Development Environment
1. Go to [Railway Dashboard](https://railway.app)
2. Select your project (**motivated-clarity** or your project name)
3. Switch to **Development** environment (top dropdown)
4. Click on your **epitome-kia** service
5. Go to **Settings** → **Source**
6. Set **Branch**: `develop`
7. Click **Deploy**

### For Production Environment
1. Switch to **Production** environment
2. Click on your **epitome-kia** service
3. Go to **Settings** → **Source**
4. Set **Branch**: `main`
5. Click **Deploy**

---

## Step 6: Test the Complete Flow

Let's test the entire CI/CD pipeline:

### 1. Create a Test Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b test/ci-cd-verification
```

### 2. Make a Small Change
```bash
echo "# CI/CD Test" >> test-file.md
git add test-file.md
git commit -m "test: verify CI/CD pipeline"
git push -u origin test/ci-cd-verification
```

### 3. Create PR to `develop`
1. Go to GitHub → You'll see "Compare & pull request" button
2. Set **base**: `develop`, **compare**: `test/ci-cd-verification`
3. Fill out the PR template
4. Click **Create pull request**

### 4. Watch CI Run
- GitHub Actions should automatically run
- You should see checks: ✓ Lint & Type Check, ✓ Unit Tests, ✓ Build
- Wait for all checks to pass (green checkmarks)

### 5. Merge to Develop
- Once all checks pass, click **Merge pull request**
- Railway should automatically deploy to Development environment
- Check Railway logs to confirm deployment

### 6. Promote to Production (Optional)
```bash
git checkout main
git pull origin main
git checkout -b release/test-deployment
git merge develop
git push -u origin release/test-deployment
```

Then create PR from `release/test-deployment` → `main`

---

## Common Issues & Solutions

### Issue: Status Checks Don't Appear in List
**Solution**: Push code first to trigger workflows. Status checks only appear after workflows run once.

### Issue: Can't Push to Protected Branch
**Solution**: This is expected! Create a PR instead.

### Issue: CI Fails on PR
**Solution**: 
```bash
# Run checks locally first
npm run lint
npm run type-check
npm run build
npm run test:run
```

### Issue: Railway Doesn't Auto-Deploy
**Solution**: 
1. Check Railway → Settings → Source → Branch is correct
2. Verify webhook is connected: Settings → GitHub App
3. Check Railway logs for build errors

---

## Workflow Diagram

```
Developer
    ↓
[Feature Branch]
    ↓ git push
    ↓
GitHub
    ↓ triggers
    ↓
[GitHub Actions CI]
  • Lint ✓
  • Type Check ✓
  • Build ✓
  • Tests ✓
    ↓
[Pull Request to develop]
    ↓ merge
    ↓
[develop branch]
    ↓ webhook
    ↓
[Railway - Development Environment] ✓ Deployed
    ↓ test thoroughly
    ↓
[Pull Request to main]
    ↓ deploy check + merge
    ↓
[main branch]
    ↓ webhook
    ↓
[Railway - Production Environment] 🚀 Live!
```

---

## Benefits of This Setup

✅ **No broken code in production** - CI catches errors before merge
✅ **Code review enforced** - PRs required for all changes
✅ **Automatic deployments** - Push to branch → Auto-deploy
✅ **Safe rollbacks** - Easy to revert via GitHub or Railway
✅ **Audit trail** - Complete history of who changed what
✅ **Collaboration ready** - Team members can contribute safely

---

## Next Steps

Once this is working:
1. Add E2E tests to CI pipeline
2. Set up Slack/Discord notifications for deployments
3. Add preview deployments for PRs (Railway feature)
4. Enable Dependabot security alerts
5. Add code coverage reporting

---

## Quick Reference Commands

```bash
# Start new feature
git checkout develop && git pull
git checkout -b feature/my-feature

# Save work
git add .
git commit -m "feat: description"
git push

# Create PR via GitHub UI
# Merge after CI passes

# Deploy to staging (develop)
# Deploy to production (main)
```

---

**Last Updated**: December 30, 2025
**Maintained By**: Epitome Kia Dev Team
