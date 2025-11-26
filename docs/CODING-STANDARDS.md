# Coding Standards

Comprehensive coding conventions and standards for mstm.dev development.

## TypeScript Standards

### Strict Mode Required

The project uses TypeScript strict mode. All type-checking options are enabled:

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitAny: true`
- `strictNullChecks: true`

**Never use `any` type.** Use `unknown` if the type is truly unknown, then narrow it with type guards.

**Never use `@ts-ignore`.** If you must suppress an error, use `@ts-expect-error` with a comment explaining why.

### Type Definitions

- Always export types and interfaces from their modules
- Use `interface` for object shapes that may be extended
- Use `type` for unions, primitives, and utility types
- Prefer `type` over empty interfaces

### Naming Conventions

- Types and interfaces: `PascalCase`
- Functions and variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE` (only for true constants)
- React components: `PascalCase`
- File names: `kebab-case.tsx` or `PascalCase.tsx` for components

## React Standards

### Component Structure

Components should follow this order:

1. Imports
2. Type definitions
3. Component definition
4. Default export

### Hooks Rules

**Always follow React hooks rules:**

- Only call hooks at the top level
- Only call hooks in React functions
- Dependencies arrays must be complete and accurate

**If ESLint suggests adding dependencies, add them.** Do not disable the rule without justification.

**Use `useCallback` for functions passed to child components** to prevent unnecessary re-renders.

**Use `useMemo` sparingly.** Only when performance profiling shows it's needed.

### Component Patterns

**Prefer function components over class components.**

**Keep components focused.** If a component exceeds 200 lines, consider breaking it down.

**Avoid creating components inside render functions.** Define them outside or in separate files.

**Props destructuring:** Destructure props in the function signature for clarity.

### State Management

**Use local state when possible.** Only lift state when multiple components need it.

**Avoid prop drilling.** If passing props through 3+ levels, consider Context or composition.

**State updates must be pure.** No side effects in state setters.

## Next.js Patterns

### App Router

The project uses Next.js 16 App Router:

- `page.tsx` for routes
- `layout.tsx` for layouts
- `loading.tsx` for loading states
- `not-found.tsx` for 404 pages

### Server vs Client Components

**Default to Server Components** unless you need:

- Interactivity (event handlers)
- Browser APIs
- State or effects
- Custom hooks

**Mark Client Components explicitly** with `'use client'` directive at the top of the file.

### Metadata

**Static pages use metadata exports:**

```tsx
export const metadata: Metadata = {
  title: "Page Name - mstm",
  description: "..."
}
```

**Content pages set titles dynamically** in components using `useLayoutEffect`:

```tsx
useLayoutEffect(() => {
  document.title = `${title} - mstm.dev`
}, [title])
```

## File Organization

### Import Order

1. React and Next.js imports
2. Third-party libraries
3. Internal utilities and types (`@lib`, `@components`)
4. Relative imports
5. CSS/styles

**Separate groups with blank lines.**

**Use path aliases:**

- `@/` for root
- `@components/` for components
- `@lib/` for utilities
- `@data/` for data files

### File Structure

**One component per file** for reusable components.

**Co-locate related files:**

- `page.tsx` and its components in the same directory
- Utility functions near where they're used

**Keep the public folder clean.** Only static assets that need specific URLs.

## Styling Standards

### Tailwind CSS

**Use Tailwind utility classes** for all styling.

**Prefer composition over custom CSS.** Only write custom CSS for complex animations or layouts that are impractical with utilities.

**Use consistent spacing:** Follow Tailwind's spacing scale (4px increments).

**Dark mode first:** All colors should work in dark mode.

### Class Names

**Use `clsx` or `cn` helper** for conditional classes.

**Order classes logically:**

1. Layout (display, position)
2. Sizing (width, height)
3. Spacing (margin, padding)
4. Typography
5. Colors
6. Effects (shadow, opacity)

## Code Quality

### ESLint

**Fix all ESLint errors before committing.** Run `npm run lint`.

**Do not disable rules** without discussing with maintainers.

**Common violations to avoid:**

- Unused variables and imports
- Missing dependencies in hooks
- Unescaped entities in JSX
- Non-pure function calls in component body

### Comments

**Code should be self-documenting.** Use clear names over comments.

**Write comments for:**

- Complex algorithms
- Non-obvious decisions
- Workarounds for bugs
- Disabled ESLint rules

**Do not comment obvious code.**

### Error Handling

**Handle errors explicitly.** Do not ignore try-catch blocks.

**User-facing errors should be friendly.** No stack traces in production UI.

**Log errors to console** in development for debugging.

## Performance

### Client-Side Performance

**All projects run in the browser.** Be mindful of:

- Bundle size
- Memory usage
- Render performance

**Avoid heavy dependencies.** Check bundle impact before adding libraries.

**Lazy load when appropriate.** Use dynamic imports for large components.

### Data Handling

**Keep data immutable.** Never mutate state directly.

**Minimize re-renders.** Use React DevTools Profiler to identify issues.

**Debounce expensive operations** like search or validation.

## Security

### Client-Side Only

**No server-side secrets.** All code runs in the browser.

**No API keys in code.** Use environment variables for any external services.

**Sanitize user input** when rendering dynamic content.

### XSS Prevention

**Never use `dangerouslySetInnerHTML`** unless absolutely necessary.

**Escape user content** when displaying it.

**Validate all inputs** even on the client side.

## Accessibility

### Semantic HTML

**Use semantic elements:** `<button>`, `<nav>`, `<main>`, etc.

**Avoid div-soup.** Choose meaningful elements.

### ARIA

**Use ARIA labels** for interactive elements without text.

**Test with keyboard navigation.** All interactive elements should be focusable.

**Respect `prefers-reduced-motion`** for animations.

## Testing Standards

### Before Committing

**Always test locally:**

1. Run `npm run lint` - Must pass
2. Run `npm run collect` - Must generate valid registry
3. Test in browser - No console errors
4. Test your specific changes thoroughly

### Manual Testing

**Check multiple scenarios:**

- Initial load
- User interactions
- Edge cases (empty state, errors)
- Different screen sizes

**Use browser DevTools:**

- Check console for errors
- Verify network requests
- Profile performance if needed

## Project-Specific Rules

### Metadata System

**Never commit without valid meta.json.** Run `npm run collect` to validate.

**Follow meta.json schema exactly.** See META-JSON.md for specification.

### Reserved Slugs

**Check reserved slugs** before creating new content. See PROJECT-STRUCTURE.md.

### Content Guidelines

**Client-side only.** Projects cannot require a backend.

**No external dependencies** unless absolutely necessary.

**Performance matters.** Keep interactions smooth.

## Git Practices

### Commits

**Follow Conventional Commits.** See COMMIT-GUIDELINES.md.

**One logical change per commit.**

**Write clear commit messages.** Explain why, not what.

### Before Pushing

**Pre-commit checklist:**

1. Code passes `npm run lint`
2. Meta.json validated with `npm run collect`
3. Tested locally
4. No console errors
5. Commit message follows convention

See COMMIT-GUIDELINES.md for details.

## Code Review

### Pull Requests

**Small, focused PRs are better.** Easier to review, faster to merge.

**Describe your changes clearly.** What and why.

**Respond to feedback constructively.**

### Reviewing Code

**Check for:**

- Follows coding standards
- No ESLint errors
- Proper TypeScript usage
- Tests have been performed
- Clear commit messages

## Documentation

### Code Documentation

**Document complex logic** with comments.

**Update docs when changing behavior.**

### Project Documentation

**Keep docs in sync with code.**

**Do not include examples unless requested.**

---

**Remember:** These standards exist to maintain code quality and consistency. Follow them, and the codebase stays healthy.
