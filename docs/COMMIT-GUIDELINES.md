# Commit Guidelines

Comprehensive guide to commit messages and pre-commit procedures for mstm.dev.

## Commit Message Format

This project follows **Conventional Commits** specification.

### Structure

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

**Required.** Must be one of:

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only changes
- `style` - Code style (formatting, missing semicolons, etc.)
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `perf` - Performance improvement
- `test` - Adding or updating tests
- `chore` - Maintenance tasks, dependency updates
- `ci` - CI/CD configuration changes

### Scope

**Optional.** Indicates what part of the codebase is affected.

**Common scopes:**
- `content` - Changes to content projects
- `browse` - Browse page changes
- `explore` - Explore page changes
- `metadata` - Metadata system changes
- `deps` - Dependency updates
- Project slug for project-specific changes

### Subject

**Required.** Brief description of the change.

**Rules:**
- Use imperative mood ("add" not "added" or "adds")
- Start with lowercase
- No period at the end
- Maximum 72 characters
- Be specific but concise

### Body

**Optional.** More detailed explanation.

**When to include:**
- Complex changes that need explanation
- Breaking changes
- Design decisions
- Alternatives considered

**Format:**
- Wrap at 72 characters
- Separate from subject with blank line
- Explain what and why, not how

### Footer

**Optional.** Reference issues or breaking changes.

**Format:**
```
BREAKING CHANGE: description
Fixes #123
Closes #456
```

---

## Commit Message Examples

### Good Commits

```
feat(content): add hex editor project

Add Hex Forge, a browser-based hex/binary editor with real-time
inspector showing integer, float, and binary representations.

Closes #45
```

```
fix(explore): search only triggers on enter

Change search behavior to only trigger when user presses Enter,
preventing style breaking from instant search on first keystroke.
```

```
docs: update setup guide with git configuration

Add Git user setup and line ending configuration sections to help
new contributors configure their development environment correctly.
```

```
refactor(browse): use authors array instead of single author

Update project card rendering to use authors.join(', ') to match
the new meta.json schema structure.
```

```
chore(deps): update next to 16.0.2
```

### Bad Commits

```
update stuff
```
**Problem:** Not descriptive, no type

```
Fixed bug
```
**Problem:** Not specific, no type, uses past tense

```
feat: added new feature for hex editing with inspector
```
**Problem:** Uses past tense, subject too long, could use scope

```
FEAT: Add Hex Editor
```
**Problem:** Type should be lowercase, subject uses title case

---

## Pre-Commit Checklist

**Before every commit, complete this checklist:**

### 1. Code Quality

**ESLint must pass:**

```bash
npm run lint
```

**Result:** No errors

**If there are errors:**
- Fix all errors before committing
- Never commit with ESLint errors
- Never use `@ts-ignore` without good reason

---

### 2. Metadata Validation

**If you modified any meta.json:**

```bash
npm run collect
```

**Result:** All projects show checkmarks

**If validation fails:**
- Fix the invalid meta.json
- Run collect again until it passes
- Verify data/projects.json was updated

---

### 3. Local Testing

**Test your changes:**

```bash
npm run dev
```

**Verify:**
- Your changes work as expected
- No console errors in browser DevTools
- No runtime errors
- Project appears in browse/explore if applicable
- Responsive design works (if applicable)

---

### 4. Build Test

**For significant changes, test the build:**

```bash
npm run build
```

**Result:** Build completes without errors

**If build fails:**
- Fix the errors
- Run build again
- Do not commit until build passes

---

### 5. Git Status

**Check what you're committing:**

```bash
git status
git diff
```

**Verify:**
- Only intended files are staged
- No debug code or console.logs
- No commented-out code
- No sensitive information

---

### 6. Commit Message

**Write a proper commit message:**

- Follows Conventional Commits format
- Type is appropriate
- Subject is clear and concise
- Body explains why if needed

---

## Commit Workflow

### Making a Commit

```bash
# 1. Stage your changes
git add <files>

# 2. Run pre-commit checks
npm run lint
npm run collect  # if meta.json changed

# 3. Review staged changes
git diff --staged

# 4. Commit with proper message
git commit -m "feat(scope): subject line"
```

### Multi-line Commit

For commits with body or footer:

```bash
git commit
```

This opens your editor. Write:

```
feat(content): add drum machine project

Add browser-based drum machine with 808-style synthesizers,
16-step sequencer, adjustable BPM and swing, and WebM recording
export. Built with Tone.js.

Closes #67
```

---

## Common Scenarios

### Adding a New Project

```bash
git add src/app/content/new-project/
npm run collect
npm run lint
git commit -m "feat(content): add new-project

Brief description of what the project does and any notable features.

Closes #123"
```

### Fixing a Bug

```bash
git add <fixed-files>
npm run lint
git commit -m "fix(component): correct issue with search behavior

Detailed explanation of what the bug was and how it's fixed."
```

### Updating Documentation

```bash
git add docs/
git commit -m "docs: improve meta.json specification

Add more examples and clarify validation rules."
```

### Refactoring Code

```bash
git add <refactored-files>
npm run lint
npm run build  # test that nothing broke
git commit -m "refactor(explore): simplify filter logic

Extract filter functions into separate utility module for better
maintainability and testing."
```

### Updating Dependencies

```bash
npm install <package>@<version>
npm run lint
npm run build
git add package.json package-lock.json
git commit -m "chore(deps): update <package> to <version>"
```

---

## Breaking Changes

### What is a Breaking Change?

Changes that require users or contributors to modify their code or workflow:

- API changes
- Removing features
- Changing meta.json schema
- Changing project structure

### How to Commit Breaking Changes

```bash
git commit
```

In your editor:

```
feat(metadata)!: change author to authors array

BREAKING CHANGE: meta.json now requires 'authors' as an array
instead of 'author' as a string.

Migration:
- Change "author": "username" to "authors": ["username"]
- Run npm run collect to validate

Closes #89
```

**Note the `!` after the type/scope.**

---

## Commit Frequency

### When to Commit

**Commit when:**
- A logical unit of work is complete
- All tests pass
- Code is in a working state

**Do not commit:**
- Incomplete features
- Broken code
- Code that doesn't pass lint
- WIP (work in progress) state

### Commit Size

**Ideal commit:**
- Single logical change
- Small enough to review easily
- Large enough to be meaningful

**Too small:**
```
fix: typo
fix: another typo
fix: one more typo
```
**Better:** Combine into one commit

**Too large:**
```
feat: add 5 new projects and refactor entire codebase
```
**Better:** Split into multiple commits

---

## Commit History

### Keep History Clean

**Use meaningful commits** that tell a story of the project's evolution.

**Avoid:**
- "WIP" commits
- "Fix" without explanation
- "Update"
- "Changes"

### Rewriting History

**Before pushing:**
- You can rebase and squash commits
- You can amend the last commit
- You can rewrite commit messages

**After pushing to PR:**
- Avoid force pushing unless necessary
- Communicate with reviewers if you rewrite history

**Never rewrite:**
- Commits on main branch
- Public history that others depend on

---

## Special Cases

### Hotfixes

For critical bugs in production:

```
fix(critical): resolve security vulnerability in hex-forge

Immediate fix for XSS vulnerability in file upload.

SECURITY: This fixes a potential XSS attack vector.
```

### Merge Commits

When merging branches, use meaningful merge commit messages:

```
Merge branch 'feature/drum-machine'

Adds drum-sys project with 808-style synthesizers and sequencer.
Includes documentation updates and meta.json.
```

### Reverting Commits

If you need to revert a commit:

```bash
git revert <commit-hash>
```

This creates a new commit that undoes the changes:

```
revert: "feat(content): add problematic-project"

This reverts commit abc123def due to performance issues that need
more investigation.
```

---

## ESLint Integration

### Pre-commit Hook

Consider setting up a pre-commit hook to automatically run lint:

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run lint
```

Make it executable:

```bash
chmod +x .git/hooks/pre-commit
```

### Skip Hooks

**Never skip pre-commit hooks** unless you have a very good reason and have discussed it with maintainers.

```bash
git commit --no-verify  # ❌ Do not do this
```

---

## Commit Message Templates

### Template Setup

Create a commit message template:

```bash
git config commit.template ~/.gitmessage
```

**~/.gitmessage:**

```
<type>(<scope>): <subject>

# Body - explain what and why, not how

# Footer - reference issues

# Types: feat, fix, docs, style, refactor, perf, test, chore, ci
# Scope: content, browse, explore, metadata, deps, or project slug
# Subject: imperative mood, lowercase, no period, max 72 chars
```

---

## Review Process

### Before Submitting PR

**Ensure all commits:**
- Follow conventional commits format
- Have clear, descriptive messages
- Are focused on single logical changes
- Pass all pre-commit checks

### During Code Review

**If reviewers request changes:**
- Make fixes in new commits
- Use clear commit messages for fixes
- Consider squashing fix commits before merge

---

## Tools

### Commitlint

The project uses commitlint to enforce commit message format.

**If your commit message is invalid:**
```
❌ Commit message does not follow Conventional Commits format
```

**Fix it:**
```bash
git commit --amend -m "correct message format"
```

### Useful Git Commands

```bash
# Amend last commit message
git commit --amend

# Amend last commit without changing message
git commit --amend --no-edit

# View commit history
git log --oneline

# View commit details
git show <commit-hash>

# Interactive rebase (reorder, squash, edit commits)
git rebase -i HEAD~3
```

---

## Summary

**Every commit must:**

1. ✅ Pass `npm run lint`
2. ✅ Pass `npm run collect` (if meta.json changed)
3. ✅ Work when tested locally
4. ✅ Have proper commit message format
5. ✅ Be a logical unit of work

**Follow this checklist, and your commits will be clean, professional, and easy to review.**

---

**Need help with commit messages?** Ask in the PR discussion or check existing commits for examples.
