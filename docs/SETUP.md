# Development Environment Setup

Complete guide to setting up your local development environment for mstm.dev.

## Prerequisites

### Required Software

- **Node.js**: 18.x or higher ([download](https://nodejs.org/))
- **npm**: 9.x or higher (comes with Node.js)
- **Git**: Latest version ([download](https://git-scm.com/))
- **Code Editor**: VS Code recommended

### Recommended VS Code Extensions

```
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript Error Translator
```

## Installation

### 1. Fork and Clone

1. Fork the repository on GitHub: [github.com/rxxuzi/mstm.dev](https://github.com/rxxuzi/mstm.dev)
2. Clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/mstm.dev.git
cd mstm.dev
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/rxxuzi/mstm.dev.git
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required packages including Next.js, React, TypeScript, and development tools.

### 3. Generate Project Registry

**Critical Step**: The platform requires a metadata registry before it can run.

```bash
npm run collect
```

This script:
- Scans `src/app/content/` for all projects
- Validates each `meta.json` file
- Generates `data/projects.json` registry

**Important**: If `data/projects.json` doesn't exist, the build will fail.

### 4. Start Development Server

```bash
npm run dev
```

The site will be available at:
- **Local**: `http://localhost:3000`
- **Network**: Check console output for network URL

## Project Commands

### Development

```bash
npm run dev          # Start dev server (auto-runs collect first)
```

### Build

```bash
npm run build        # Production build (auto-runs collect first)
npm start            # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run collect      # Manually run metadata collection
```

## Development Workflow

### Standard Workflow

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Make changes** to your code

3. **Hot reload** happens automatically

4. **If you modify `meta.json` files**:
   - Stop dev server (Ctrl+C)
   - Run `npm run collect`
   - Restart dev server

### Testing Your Changes

1. **Visit the site**: `http://localhost:3000`
2. **Browse projects**: `/browse`
3. **Test your project**: `/content/your-project-name`
4. **Check console**: No errors should appear

## Verifying Setup

### 1. Check Node Version

```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

### 2. Verify Installation

```bash
# Should list all installed packages
npm list --depth=0
```

### 3. Check Data Directory

```bash
# Should exist after npm run collect
ls data/projects.json

# On Windows
dir data\projects.json
```

### 4. Test Build

```bash
npm run build
```

Should complete without errors.

## Common Issues

### Issue: "Cannot find module 'data/projects.json'"

**Cause**: Metadata registry not generated

**Solution**:
```bash
npm run collect
```

### Issue: "Port 3000 is already in use"

**Cause**: Another process is using port 3000

**Solution**:

**Windows**:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux**:
```bash
lsof -ti:3000 | xargs kill -9
```

Or use different port:
```bash
PORT=3001 npm run dev
```

### Issue: "Unexpected token in JSON"

**Cause**: Invalid JSON in a `meta.json` file

**Solution**:
1. Run `npm run collect` to see which file has errors
2. Validate JSON syntax at [jsonlint.com](https://jsonlint.com/)
3. Fix the invalid JSON
4. Run `npm run collect` again

### Issue: "Module not found" errors

**Cause**: Dependencies not installed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build succeeds but site is broken

**Cause**: TypeScript errors ignored

**Solution**:
1. Check `npm run lint` output
2. Fix all TypeScript errors
3. Never use `@ts-ignore` without good reason

## Environment Variables

mstm.dev does not use environment variables for development. All configuration is in code.

**Note**: All content projects run client-side, so:
- No server-side secrets
- No API keys in code
- All code is visible to users

## Git Configuration

### Set Up Git User

```bash
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

### Configure Line Endings

**Windows**:
```bash
git config --global core.autocrlf true
```

**Mac/Linux**:
```bash
git config --global core.autocrlf input
```

## Editor Setup

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### ESLint Configuration

The project includes a strict ESLint configuration. Do not disable rules without discussion.

## Performance Tips

### Faster Builds

```bash
# Skip type checking during dev (faster)
npm run dev

# Full build with type checking
npm run build
```

### Clear Cache

If experiencing issues:

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules
npm install
```

## Next Steps

1. Read [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) to understand the codebase
2. Review [CODING-STANDARDS.md](./CODING-STANDARDS.md) before writing code
3. Check [META-JSON.md](./META-JSON.md) to learn about project metadata
4. See [BRANCH-STRATEGY.md](./BRANCH-STRATEGY.md) for Git workflow

## Updating Your Fork

Keep your fork in sync with upstream:

```bash
# Fetch upstream changes
git fetch upstream

# Merge into your main branch
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

---

**Setup Complete?** → Continue to [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)
