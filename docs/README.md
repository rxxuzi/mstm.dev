# mstm.dev Developer Documentation

Official documentation for contributing to [mstm.dev](https://mstm.dev) - A community-driven platform for developer tools and digital experiments.

**Repository**: [github.com/rxxuzi/mstm.dev](https://github.com/rxxuzi/mstm.dev)

## Project Philosophy

### Core Principles

**1. Community First**
- Built by developers, for developers
- No corporate interests, no profit motives
- Open source, transparent, community-governed

**2. Client-Side Focus**
- All projects run in the browser
- No backend required
- Privacy-first: no data leaves the user's machine

**3. Zero Friction**
- No accounts, no sign-ups, no paywalls
- Instant access to all tools
- Fast, responsive, minimal dependencies

**4. Quality Over Quantity**
- Strict code review process
- Performance and accessibility matter
- Every project should be useful and well-crafted

### Platform Vision

Developer tools are fragmented across the web. mstm.dev provides a unified platform where the community builds and maintains high-quality tools together. One codebase, one deployment, infinite possibilities.

## Documentation Structure

### Getting Started
- **[SETUP.md](./SETUP.md)** - Development environment setup
- **[PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md)** - Understanding the codebase structure

### Core Guides
- **[META-JSON.md](./META-JSON.md)** - Complete meta.json specification
- **[CODING-STANDARDS.md](./CODING-STANDARDS.md)** - Code style and conventions
- **[COMMIT-GUIDELINES.md](./COMMIT-GUIDELINES.md)** - Commit rules and pre-commit checklist

### Contribution Workflow
- **[BRANCH-STRATEGY.md](./BRANCH-STRATEGY.md)** - Git workflow and branching model
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Pull request submission process

## Quick Reference

### Essential Commands

```bash
# Setup
npm install              # Install dependencies
npm run collect          # Generate project metadata registry

# Development
npm run dev              # Start dev server (auto-runs collect)
npm run build            # Production build (auto-runs collect)

# Quality Checks
npm run lint             # Run ESLint
npm run collect          # Validate all meta.json files
```

### Pre-Commit Checklist

Before committing, always:

1. ✅ Run `npm run lint` - No errors
2. ✅ Run `npm run collect` - Metadata valid
3. ✅ Test locally - Project works
4. ✅ Check console - No errors
5. ✅ Follow commit message format

See [COMMIT-GUIDELINES.md](./COMMIT-GUIDELINES.md) for details.

## Project Stack

### Core Technologies
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **ESLint** (strict configuration)

### Key Libraries
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library
- **Vercel Analytics** - Privacy-focused analytics

## Repository Structure

```
mstm.dev/
├── src/
│   ├── app/
│   │   ├── (pages)/        # Static pages (about, browse, etc.)
│   │   ├── content/        # User-contributed projects
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Shared components
│   └── lib/                # Utilities and types
├── scripts/
│   └── collect-metadata.ts # Metadata collection & validation
├── data/
│   └── projects.json       # Generated project registry
├── docs/                   # This documentation
└── public/                 # Static assets
```

## Getting Help

### Resources
- 📚 Read the documentation in this directory
- 🐛 [Open an issue](https://github.com/rxxuzi/mstm.dev/issues)
- 💬 [Discussions](https://github.com/rxxuzi/mstm.dev/discussions)
- 📧 Contact: [GitHub Issues](https://github.com/rxxuzi/mstm.dev/issues)

### Common Issues

**Build fails**: Ensure `npm run collect` has been run
**Lint errors**: Run `npm run lint` and fix all errors
**Project not showing**: Check `meta.json` validation with `npm run collect`

## Code of Conduct

- Be respectful and constructive
- Write clean, maintainable code
- Test thoroughly before submitting
- Follow all guidelines in this documentation
- Give credit where credit is due

## License

This project is licensed under the MIT License. By contributing, you agree that your contributions will be licensed under the same license.

---

**Ready to contribute?** Start with [SETUP.md](./SETUP.md) → [CONTRIBUTING.md](./CONTRIBUTING.md)
