# Branch Strategy

Git workflow and branching model for mstm.dev development.

## Overview

This project uses a simplified Git workflow optimized for community contributions and continuous deployment.

## Branch Structure

### Main Branch

**Branch:** `main`

**Purpose:** Production-ready code

**Rules:**
- Always deployable
- Protected branch
- All changes via pull requests
- Direct commits not allowed
- Must pass all checks before merge

**Deployment:** Automatically deploys to production on merge

---

### Feature Branches

**Naming:** `feature/<description>`

**Purpose:** Developing new features or projects

**Created from:** `main`

**Merged into:** `main` (via pull request)

---

### Fix Branches

**Naming:** `fix/<description>`

**Purpose:** Bug fixes and corrections

**Created from:** `main`

**Merged into:** `main` (via pull request)

---

### Documentation Branches

**Naming:** `docs/<description>`

**Purpose:** Documentation updates

**Created from:** `main`

**Merged into:** `main` (via pull request)

---

### Refactor Branches

**Naming:** `refactor/<description>`

**Purpose:** Code refactoring without functional changes

**Created from:** `main`

**Merged into:** `main` (via pull request)

---

## Workflow

### Starting New Work

#### 1. Sync with Main

```bash
git checkout main
git pull origin main
```

#### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch naming rules:**
- Use lowercase
- Use hyphens for spaces
- Be descriptive but concise
- Match the type of work (feature/fix/docs/refactor)

---

### During Development

#### 1. Make Changes

Edit files, add features, fix bugs.

#### 2. Commit Regularly

```bash
git add <files>
npm run lint
npm run collect  # if meta.json changed
git commit -m "feat(scope): description"
```

Follow [COMMIT-GUIDELINES.md](./COMMIT-GUIDELINES.md)

#### 3. Keep Branch Updated

Periodically sync with main to avoid conflicts:

```bash
git fetch origin
git rebase origin/main
```

Or use merge if you prefer:

```bash
git fetch origin
git merge origin/main
```

---

### Submitting Changes

#### 1. Final Checks

```bash
# Ensure all tests pass
npm run lint
npm run collect
npm run build

# Verify changes work
npm run dev
```

#### 2. Push Branch

```bash
git push origin feature/your-feature-name
```

If you rebased:

```bash
git push origin feature/your-feature-name --force-with-lease
```

#### 3. Open Pull Request

See [CONTRIBUTING.md](../CONTRIBUTING.md) for PR process.

---

## Pull Request Process

### Creating a PR

**Title format:**

```
<type>(<scope>): <description>
```

Same as commit message format.

**Description should include:**
- What changed
- Why it changed
- How to test
- Screenshots (if UI changes)
- Related issues

### PR Review

**Reviewers check:**
- Code quality
- Follows coding standards
- Tests pass
- Documentation updated
- Commit messages follow guidelines

### After Approval

**Merge methods:**

1. **Squash and merge** (preferred for multiple commits)
   - Combines all commits into one
   - Clean history on main
   - Use when you have many small commits

2. **Rebase and merge** (for clean commit history)
   - Keeps individual commits
   - Use when commits are well-structured

3. **Merge commit** (rarely used)
   - Creates merge commit
   - Use for large feature branches with logical commit structure

### After Merge

**Delete the branch:**

```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

GitHub can do this automatically.

---

## Branch Naming Conventions

### Format

```
<type>/<description>
```

### Types

- `feature/` - New features or projects
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `style/` - Code style changes
- `test/` - Test additions or updates
- `chore/` - Maintenance tasks

### Description

**Good:**
- `feature/hex-editor`
- `fix/search-enter-key`
- `docs/improve-meta-json-guide`
- `refactor/simplify-metadata-collection`

**Bad:**
- `feature/new-stuff`
- `fix/bug`
- `my-branch`
- `update`

---

## Working with Forks

### Forking the Repository

Most contributors work from forks:

#### 1. Fork on GitHub

Click "Fork" button on github.com/rxxuzi/mstm.dev

#### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/mstm.dev.git
cd mstm.dev
```

#### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/rxxuzi/mstm.dev.git
```

#### 4. Verify Remotes

```bash
git remote -v
```

Should show:
```
origin    https://github.com/YOUR_USERNAME/mstm.dev.git (fetch)
origin    https://github.com/YOUR_USERNAME/mstm.dev.git (push)
upstream  https://github.com/rxxuzi/mstm.dev.git (fetch)
upstream  https://github.com/rxxuzi/mstm.dev.git (push)
```

---

### Keeping Fork Updated

#### Sync Main Branch

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

#### Sync Feature Branch

```bash
git checkout feature/your-feature
git fetch upstream
git rebase upstream/main
git push origin feature/your-feature --force-with-lease
```

---

## Handling Conflicts

### When Conflicts Occur

Conflicts happen when:
- Your branch is out of sync with main
- Multiple people edit the same file
- Large time gap between branch creation and PR

### Resolving Conflicts

#### 1. Update Your Branch

```bash
git checkout feature/your-feature
git fetch upstream
git rebase upstream/main
```

#### 2. Resolve Conflicts

Git will pause on conflicting files:

```bash
# Open conflicting files in editor
# Look for conflict markers:
<<<<<<< HEAD
Current code
=======
Your changes
>>>>>>> feature/your-feature
```

Edit files to resolve conflicts.

#### 3. Continue Rebase

```bash
git add <resolved-files>
git rebase --continue
```

#### 4. Push Updated Branch

```bash
git push origin feature/your-feature --force-with-lease
```

### Avoiding Conflicts

**Best practices:**
- Keep branches short-lived
- Sync with main regularly
- Communicate with other contributors
- Work on focused, isolated changes

---

## Multiple Commits

### When to Squash

**Squash commits when:**
- You have many "WIP" commits
- Commits are small fixes to previous commits
- Commit history is messy

**How to squash:**

```bash
git rebase -i HEAD~N  # N = number of commits to squash
```

In the editor:
```
pick abc123 First commit
squash def456 Fix typo
squash ghi789 Another fix
```

### When to Keep Separate Commits

**Keep commits separate when:**
- Each commit is a logical unit
- Commits tell a story of development
- Easier to review separately

---

## Protected Branches

### Main Branch Protection

**Rules enforced:**
- Require pull request reviews
- Require status checks to pass
- No force pushes
- No deletions

**You cannot:**
- Push directly to main
- Force push to main
- Delete main branch

**You must:**
- Create a pull request
- Get approval from maintainers
- Pass all checks

---

## Emergency Hotfixes

### Critical Bugs in Production

#### 1. Create Hotfix Branch

```bash
git checkout main
git pull origin main
git checkout -b fix/critical-security-issue
```

#### 2. Make Minimal Fix

**Only fix the critical issue.** No refactoring, no features.

#### 3. Test Thoroughly

```bash
npm run lint
npm run build
npm run dev
```

#### 4. Fast-track PR

Create PR with:
- Clear description of the issue
- Minimal changes
- "URGENT" or "HOTFIX" in title

#### 5. Deploy Immediately

After approval, merge and deploy quickly.

---

## Long-running Branches

### Avoid When Possible

Long-running branches cause:
- Merge conflicts
- Integration issues
- Stale code

### If Unavoidable

**For large features:**

1. Break into smaller sub-features
2. Merge incremental PRs
3. Use feature flags if needed
4. Sync with main daily

---

## Git Best Practices

### Commit Often

**Small, frequent commits are better than large, infrequent ones.**

### Write Clear Messages

**Every commit should explain what and why.**

### Test Before Pushing

**Never push untested code.**

### Keep Branches Focused

**One branch, one purpose.**

### Delete Merged Branches

**Clean up after merging to avoid clutter.**

### Use Force Push Carefully

**Only use `--force-with-lease`, never `--force`.**

---

## Common Workflows

### Adding a New Project

```bash
# 1. Create branch
git checkout main
git pull origin main
git checkout -b feature/new-project-name

# 2. Create project files
mkdir src/app/content/new-project-name
# ... create meta.json, page.tsx, etc.

# 3. Validate and test
npm run collect
npm run lint
npm run dev

# 4. Commit
git add src/app/content/new-project-name/
git commit -m "feat(content): add new-project-name"

# 5. Push and create PR
git push origin feature/new-project-name
```

### Fixing a Bug

```bash
# 1. Create fix branch
git checkout main
git pull origin main
git checkout -b fix/bug-description

# 2. Fix the bug
# ... edit files

# 3. Test fix
npm run lint
npm run dev

# 4. Commit
git add <fixed-files>
git commit -m "fix(component): resolve bug-description"

# 5. Push and create PR
git push origin fix/bug-description
```

### Updating Documentation

```bash
# 1. Create docs branch
git checkout main
git pull origin main
git checkout -b docs/update-setup-guide

# 2. Update documentation
# ... edit docs

# 3. Commit
git add docs/
git commit -m "docs: improve setup guide clarity"

# 4. Push and create PR
git push origin docs/update-setup-guide
```

---

## Troubleshooting

### Branch Out of Sync

```bash
git fetch upstream
git rebase upstream/main
```

### Accidentally Committed to Main

```bash
# Move commits to new branch
git branch feature/backup
git reset --hard origin/main
git checkout feature/backup
```

### Need to Undo Last Commit

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Discard changes and commit
git reset --hard HEAD~1
```

### Force Push Failed

**Never use `--force`, use `--force-with-lease`:**

```bash
git push origin feature/branch --force-with-lease
```

This prevents overwriting others' work.

---

## Summary

**Branch workflow:**
1. Start from updated main
2. Create descriptive branch
3. Make focused changes
4. Commit with clear messages
5. Keep branch updated
6. Test thoroughly
7. Push and create PR
8. Address review feedback
9. Merge when approved
10. Delete branch

**Follow this workflow, and collaboration will be smooth and efficient.**

---

**Questions about branching?** Ask in discussions or check existing PRs for examples.
