# Contributing Guide

Complete guide to contributing code, projects, and improvements to mstm.dev.

## Before You Start

### Read the Documentation

Familiarize yourself with:

1. **[SETUP.md](./SETUP.md)** - Set up your development environment
2. **[PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)** - Understand the codebase
3. **[CODING-STANDARDS.md](./CODING-STANDARDS.md)** - Follow code conventions
4. **[META-JSON.md](./META-JSON.md)** - Learn metadata requirements
5. **[COMMIT-GUIDELINES.md](./COMMIT-GUIDELINES.md)** - Write proper commits
6. **[BRANCH-STRATEGY.md](./BRANCH-STRATEGY.md)** - Understand Git workflow

### Prerequisites

Ensure you have:
- Node.js 18.x or higher
- npm 9.x or higher
- Git installed and configured
- GitHub account
- Code editor (VS Code recommended)

---

## Types of Contributions

### 1. Adding New Projects

**What:** New tools, games, or art projects

**Requirements:**
- Client-side only (runs in browser)
- Follows platform conventions
- High quality and useful
- Well-documented code

**See:** Root [CONTRIBUTING.md](../CONTRIBUTING.md) for quick start guide

---

### 2. Platform Improvements

**What:** Enhancements to core platform functionality

**Examples:**
- Improving browse/explore pages
- Adding new features to shared components
- Performance optimizations
- UI/UX improvements

**Requires:** Discussion with maintainers first

---

### 3. Bug Fixes

**What:** Fixing broken functionality or errors

**Requirements:**
- Identify the issue clearly
- Test the fix thoroughly
- Avoid breaking other features

---

### 4. Documentation

**What:** Improving guides, fixing typos, adding clarity

**Requirements:**
- Clear and concise writing
- Follow existing documentation style
- Keep examples relevant

---

## Contribution Workflow

### Step 1: Fork and Clone

#### Fork the Repository

1. Visit [github.com/rxxuzi/mstm.dev](https://github.com/rxxuzi/mstm.dev)
2. Click "Fork" button
3. Wait for fork to complete

#### Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/mstm.dev.git
cd mstm.dev
```

#### Add Upstream Remote

```bash
git remote add upstream https://github.com/rxxuzi/mstm.dev.git
git remote -v
```

---

### Step 2: Set Up Environment

#### Install Dependencies

```bash
npm install
```

#### Generate Metadata Registry

```bash
npm run collect
```

This creates `data/projects.json` required for the build.

#### Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to verify setup.

---

### Step 3: Create a Branch

#### Update Main Branch

```bash
git checkout main
git pull upstream main
```

#### Create Feature Branch

```bash
git checkout -b type/description
```

**Branch naming:**
- `feature/project-name` - New projects
- `feature/improvement` - Platform improvements
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation

See [BRANCH-STRATEGY.md](./BRANCH-STRATEGY.md) for details.

---

### Step 4: Make Changes

#### For New Projects

```bash
mkdir src/app/content/your-project-name
cd src/app/content/your-project-name
```

**Create `meta.json`:**

```json
{
  "title": "Your Project",
  "description": "Brief description of what it does.",
  "type": "tool",
  "category": "development",
  "tags": ["tag1", "tag2", "tag3"],
  "authors": ["your-github-username"],
  "mobile": true,
  "createdAt": "2025-11-26",
  "license": "MIT"
}
```

See [META-JSON.md](./META-JSON.md) for complete specification.

**Create `page.tsx`:**

```tsx
'use client'

export default function YourProjectPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Your Project</h1>
      {/* Your project code */}
    </div>
  )
}
```

See [CODING-STANDARDS.md](./CODING-STANDARDS.md) for conventions.

#### For Platform Changes

Edit existing files following:
- Coding standards
- TypeScript strict mode
- ESLint rules
- Existing patterns

---

### Step 5: Test Your Changes

#### Validate Metadata

If you created or modified `meta.json`:

```bash
npm run collect
```

Must pass without errors.

#### Lint Your Code

```bash
npm run lint
```

Fix all errors before committing.

#### Test in Browser

```bash
npm run dev
```

**Check:**
- Your changes work correctly
- No console errors
- No runtime errors
- Responsive design (if applicable)
- Cross-browser compatibility

#### Test Build

For significant changes:

```bash
npm run build
```

Must complete without errors.

---

### Step 6: Commit Your Changes

#### Stage Changes

```bash
git add <files>
```

#### Pre-Commit Checks

Run through the checklist:

1. ✅ `npm run lint` passes
2. ✅ `npm run collect` passes (if meta.json changed)
3. ✅ Tested locally and works
4. ✅ No console errors
5. ✅ Code follows standards

#### Create Commit

```bash
git commit -m "type(scope): description"
```

**Follow Conventional Commits:**

```
feat(content): add hex editor project

Add Hex Forge, a browser-based hex/binary editor with real-time
inspector showing integer, float, and binary representations.
```

See [COMMIT-GUIDELINES.md](./COMMIT-GUIDELINES.md) for details.

---

### Step 7: Push Your Branch

```bash
git push origin type/description
```

If you rebased and need to force push:

```bash
git push origin type/description --force-with-lease
```

---

### Step 8: Open Pull Request

#### Create PR on GitHub

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill in PR template

#### PR Title Format

```
<type>(<scope>): <description>
```

**Examples:**
- `feat(content): add drum machine project`
- `fix(explore): correct search behavior on mobile`
- `docs: improve setup guide clarity`

#### PR Description

**Include:**

1. **What** - What does this PR do?
2. **Why** - Why is this change needed?
3. **How** - How does it work? (if complex)
4. **Testing** - How did you test it?
5. **Screenshots** - If UI changes

**Template:**

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] New project
- [ ] Platform improvement
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring

## Changes Made

- Change 1
- Change 2
- Change 3

## Testing Done

- Tested locally
- Ran npm run lint
- Ran npm run collect
- Tested on multiple browsers
- Tested on mobile (if applicable)

## Screenshots

<!-- If applicable, add screenshots here -->

## Checklist

- [ ] Code follows coding standards
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Commit messages follow guidelines
- [ ] No console errors
- [ ] Mobile-friendly (if applicable)

## Related Issues

Closes #123
```

---

### Step 9: Code Review

#### Respond to Feedback

**When reviewers comment:**

1. Read feedback carefully
2. Ask questions if unclear
3. Make requested changes
4. Push new commits to same branch
5. Respond to comments

**Be professional:**
- Thank reviewers for their time
- Explain your reasoning when appropriate
- Accept constructive criticism
- Make changes promptly

#### Making Changes After Review

```bash
# Make changes
git add <files>
git commit -m "fix: address review feedback"
git push origin type/description
```

PR updates automatically.

---

### Step 10: Merge

#### When Approved

**Maintainers will:**
1. Review code quality
2. Test functionality
3. Approve PR
4. Merge to main
5. Deploy to production

**You can:**
- Delete your branch after merge
- Continue with new contributions

#### After Merge

```bash
# Update local main
git checkout main
git pull upstream main

# Delete local branch
git branch -d type/description

# Delete remote branch
git push origin --delete type/description
```

---

## Quality Standards

### Code Quality

**Required:**
- No ESLint errors
- TypeScript strict mode compliance
- No console errors in browser
- Proper error handling
- Clean, readable code

**Preferred:**
- Minimal dependencies
- Good performance
- Accessible UI
- Mobile-friendly

### Project Quality

**For new projects:**
- Useful and functional
- Well-designed UI
- Good user experience
- Clear purpose
- No bugs or crashes

### Documentation Quality

**For all contributions:**
- Clear comments where needed
- Updated documentation
- Accurate meta.json
- Helpful README (if complex project)

---

## Best Practices

### Before Starting

1. **Check existing issues** - Someone may be working on it
2. **Create an issue** - Discuss major changes first
3. **Keep scope small** - Easier to review and merge
4. **One feature per PR** - Don't mix unrelated changes

### During Development

1. **Commit frequently** - Small, logical commits
2. **Test thoroughly** - Catch issues early
3. **Follow conventions** - Consistency matters
4. **Document as you go** - Don't leave it for later

### Before Submitting

1. **Self-review your code** - Catch obvious issues
2. **Test on multiple browsers** - Ensure compatibility
3. **Check mobile responsiveness** - If applicable
4. **Read your diff** - Make sure only intended changes are included

---

## Common Issues

### Build Fails with "Cannot find module 'data/projects.json'"

**Solution:**
```bash
npm run collect
```

### ESLint Errors

**Solution:**
```bash
npm run lint
# Fix reported errors
```

### Port 3000 Already in Use

**Solution:**

Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Mac/Linux:
```bash
lsof -ti:3000 | xargs kill -9
```

Or use different port:
```bash
PORT=3001 npm run dev
```

### Git Conflicts

**Solution:**
```bash
git fetch upstream
git rebase upstream/main
# Resolve conflicts in editor
git add <resolved-files>
git rebase --continue
git push origin your-branch --force-with-lease
```

### Meta.json Validation Fails

**Solution:**
1. Check JSON syntax at [jsonlint.com](https://jsonlint.com/)
2. Verify all required fields present
3. Check date format (yyyy-mm-dd)
4. Ensure authors is array

---

## Getting Help

### Resources

1. **Documentation** - Check docs/ directory
2. **Existing code** - See how similar features work
3. **Issues** - Search for related discussions
4. **Discussions** - Ask questions

### Asking Questions

**Good questions include:**
- What you're trying to do
- What you've tried
- Error messages
- Relevant code snippets

**Where to ask:**
- GitHub Issues - Bug reports, feature requests
- GitHub Discussions - General questions
- PR comments - Specific to your PR

---

## Code of Conduct

### Be Respectful

- Treat everyone with respect
- Be constructive in feedback
- Welcome newcomers
- Give credit to others

### Be Professional

- Write clean, maintainable code
- Follow established conventions
- Test your changes
- Document your work

### Be Collaborative

- Respond to feedback
- Help others when possible
- Share knowledge
- Build something great together

Read the full [Code of Conduct](../CODE_OF_CONDUCT.md).

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License (or the license specified in your project's meta.json).

All submitted code must be compatible with the project's MIT license.

---

## Recognition

### Contributors

All contributors are recognized in:
- Git history
- Project authors field
- Community acknowledgments

### Featured Projects

Exceptional projects may be:
- Featured on homepage
- Highlighted in announcements
- Showcased in documentation

**Criteria:**
- Outstanding quality
- Unique functionality
- Excellent user experience
- Well-documented

---

## Advanced Topics

### Complex Projects

**For large projects:**
1. Discuss architecture with maintainers first
2. Break into smaller PRs when possible
3. Provide comprehensive documentation
4. Include usage instructions

### Platform Contributions

**For core changes:**
1. Open issue for discussion first
2. Ensure backward compatibility
3. Update affected documentation
4. Consider impact on existing projects
5. Test thoroughly across all scenarios

### Performance Considerations

**When optimizing:**
1. Profile before optimizing
2. Measure improvements
3. Document trade-offs
4. Avoid premature optimization

---

## Continuous Improvement

### Stay Updated

**Keep your fork synchronized:**

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

Do this regularly to avoid large merge conflicts.

### Learn from Reviews

**Code reviews are learning opportunities:**
- Understand reviewer feedback
- Ask questions to learn
- Apply lessons to future PRs
- Share knowledge with others

---

## Summary

**Contribution checklist:**

1. ✅ Fork and clone repository
2. ✅ Set up development environment
3. ✅ Create feature branch
4. ✅ Make changes following standards
5. ✅ Test thoroughly
6. ✅ Pass lint and collect checks
7. ✅ Write proper commit messages
8. ✅ Push to your fork
9. ✅ Open pull request with clear description
10. ✅ Respond to review feedback
11. ✅ Celebrate when merged!

**Remember:**
- Quality over quantity
- Follow established conventions
- Test before submitting
- Be responsive to feedback
- Have fun building!

---

**Ready to contribute?** Start with [SETUP.md](./SETUP.md) to set up your environment.

**Questions?** Open an issue or discussion on GitHub.

**Happy contributing!** 🚀
