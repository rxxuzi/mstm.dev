# Contributing to mstm.dev

Thank you for your interest in contributing to mstm.dev! This document provides guidelines for adding your projects to the platform.

## Quick Start

1. Fork the repository
2. Create your project folder in `src/app/content/`
3. Add `meta.json` and `page.tsx`
4. Test locally
5. Submit a pull request

## Project Structure
```
src/app/content/
└── your-project-name/
    ├── meta.json          (required)
    ├── page.tsx           (required)
    ├── components/        (optional)
    ├── lib/              (optional)
    └── assets/           (optional)
```

## meta.json Format
```json
{
  "title": "Your Project Name",
  "description": "Brief description (1-2 sentences, max 200 chars)",
  "type": "tool",
  "category": "development",
  "tags": ["tag1", "tag2", "tag3"],
  "authors": ["your-github-username"],
  "featured": false,
  "mobile": true,
  "createdAt": "2025-11-24",
  "license": "MIT"
}
```

### Field Descriptions

| Field         | Type     | Required  | Description                                                   |
|---------------|----------|:---------:|---------------------------------------------------------------|
| `title`       | string   |     ✅     | Display name of your project                                  |
| `description` | string   |     ✅     | Brief description (1-2 sentences)                             |
| `type`        | string   |     ✅     | One of: `tool`, `art`, `game`, `other`                        |
| `category`    | string   |     ✅     | Subcategory (e.g., `image`, `text`, `development`)            |
| `tags`        | string[] |     ✅     | 3-5 relevant tags for searchability                           |
| `authors`     | string[] |     ✅     | GitHub usernames of contributors                              |
| `featured`    | boolean  |     ❌     | Set to `false` (maintainers may feature exceptional projects) |
| `mobile`      | boolean  |     ✅     | `true` if mobile-responsive, `false` otherwise                |
| `createdAt`   | string   |     ✅     | Date in `yyyy-mm-dd` format                                   |
| `license`     | string   |     ❌     | Defaults to MIT if not specified                              |

### Categories

Common categories include:
- **Tools**: `image`, `video`, `text`, `data`, `development`, `security`
- **Art**: `generative`, `interactive`, `visualization`, `3d`
- **Games**: `puzzle`, `arcade`, `strategy`, `simulation`
- **Other**: `educational`, `experimental`, `demo`

## Reserved Project Names

The following slugs cannot be used as project names:

- Static pages: `about`, `browse`, `contribute`, `docs`, `explore`, `privacy`, `license`, `contact`
- Future pages: `new`, `latest`, `popular`, `trending`, `blog`, `roadmap`, `search`, `tags`
- Technical: `api`, `sitemap`, `robots`, `favicon`, `manifest`, `_next`, `static`
- Single characters: All single-letter slugs (`a-z`, `0-9`)

### Naming Rules

- Use **kebab-case** only
- Minimum length: 2 characters
- No special characters except `-`
- No leading `_` or `.`

## Development Guidelines

### Quality Standards

- **Polish over quantity**: Take time to refine your work
- **Client-side first**: Prefer browser-based solutions when possible
- **Minimal dependencies**: Keep your project lightweight
- **Document your code**: Add comments where helpful
- **Test thoroughly**: Ensure it works across browsers

### Code Style

- Use TypeScript when possible
- Follow existing code patterns
- Keep components self-contained
- Avoid modifying global utilities

### Mobile Support

If your project supports mobile:
- Test on actual mobile devices
- Ensure touch interactions work
- Consider screen size constraints
- Set `"mobile": true` in meta.json

If mobile support is not feasible:
- Set `"mobile": false` in meta.json
- Consider displaying a notice to mobile users

## Submission Process

1. **Create a branch**
```bash
   git checkout -b content/your-project-name
```

2. **Build your project**
```bash
   mkdir -p src/app/content/your-project-name
   cd src/app/content/your-project-name
   # Create meta.json and page.tsx
```

3. **Test locally**
```bash
   npm run dev
   # Visit http://localhost:3000/your-project-name
```

4. **Commit and push**
```bash
   git add .
   git commit -m "feat: add your-project-name"
   git push origin content/your-project-name
```

5. **Open a pull request**
    - Use a clear title: "Add: Your Project Name"
    - Describe what your project does
    - Include screenshots if applicable
    - Link to any relevant issues

## Pull Request Template
```markdown
## Type
- [ ] New tool
- [ ] New art project
- [ ] New game
- [ ] Platform improvement
- [ ] Bug fix

## Description
<!-- What does this project do? -->

## Screenshots
<!-- If applicable -->

## Mobile Support
- [ ] Fully responsive
- [ ] Desktop only

## Checklist
- [ ] Tested locally
- [ ] meta.json is valid
- [ ] Follows naming conventions
- [ ] Code is documented
- [ ] No lint errors
```

## Code of Conduct

Be respectful, constructive, and kind. We're building something useful together.

Read the full [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under MIT (or the license you specify in your meta.json).

## Questions?

- Check the [docs](https://mstm.dev/docs)
- Open an [issue](https://github.com/rxxuzi/mstm.dev/issues)

---

**Happy building!** 🚀