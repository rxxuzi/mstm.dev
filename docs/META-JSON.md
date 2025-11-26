# meta.json Specification

Complete guide to creating valid `meta.json` files for mstm.dev projects.

## Overview

Every project in `src/app/content/` requires a `meta.json` file that describes the project's metadata. This file is validated during the build process and used to generate the project registry.

## File Location

```
src/app/content/
└── your-project-name/
    ├── meta.json  ← Required
    └── page.tsx
```

## Required Fields

### title

**Type:** `string`
**Required:** Yes

The display name of your project. Should be concise and descriptive.

**Rules:**
- 3-50 characters recommended
- Title case preferred
- No special formatting needed

**Validation:** Must be a non-empty string

---

### description

**Type:** `string`
**Required:** Yes

A brief description of what your project does. Displayed in browse/explore pages and search results.

**Rules:**
- 100-200 characters recommended
- Should be a complete sentence or two
- Focus on what the project does, not how it works
- No marketing fluff

**Validation:** Must be a non-empty string

---

### type

**Type:** `"tool" | "art" | "game" | "other"`
**Required:** Yes

The primary category of your project.

**Options:**
- `"tool"` - Utilities, editors, converters, analyzers
- `"art"` - Visual experiments, generative art, creative tools
- `"game"` - Interactive games and puzzles
- `"other"` - Anything that doesn't fit the above

**Validation:** Must be one of the four valid types

---

### category

**Type:** `string`
**Required:** Yes

A more specific classification within the type.

**Common categories by type:**

**tool:**
- `"development"` - Developer tools, code editors
- `"audio"` - Audio processing, music tools
- `"utility"` - General utilities
- `"converter"` - Format converters

**art:**
- `"generative"` - Generative art
- `"visual"` - Visual experiments
- `"interactive"` - Interactive art

**game:**
- `"puzzle"` - Logic puzzles, brain teasers
- `"arcade"` - Action games
- `"simulation"` - Simulations

**Validation:** Must be a non-empty string

---

### tags

**Type:** `string[]`
**Required:** Yes

Array of relevant keywords for search and filtering.

**Rules:**
- 3-10 tags recommended
- Use lowercase kebab-case
- Be specific but not redundant
- Include technology names if relevant

**Validation:** Must be a non-empty array

---

### authors

**Type:** `string[]`
**Required:** Yes

Array of project author usernames.

**Rules:**
- Must have at least one author
- Use GitHub usernames when possible
- List primary author first
- Maximum 5 authors recommended

**Validation:** Must be a non-empty array

---

### mobile

**Type:** `boolean`
**Required:** Yes

Whether the project works well on mobile devices.

**Rules:**
- `true` - Project is mobile-friendly
- `false` - Desktop only (keyboard required, complex UI, etc.)

**Validation:** Must be a boolean value

---

### createdAt

**Type:** `string`
**Required:** Yes

The date when the project was first created.

**Format:** `yyyy-mm-dd`

**Validation:** Must match the regex `^\d{4}-\d{2}-\d{2}$`

---

## Optional Fields

### featured

**Type:** `boolean`
**Required:** No
**Default:** `false`

Whether the project should be featured on the homepage.

**Rules:**
- Set to `true` only for exceptional projects
- Requires maintainer approval
- Featured projects must be high quality

---

### updatedAt

**Type:** `string`
**Required:** No

The date when the project was last significantly updated.

**Format:** `yyyy-mm-dd`

**Rules:**
- Update this when making major changes
- Not needed for minor fixes
- Should be later than `createdAt`

---

### license

**Type:** `string`
**Required:** No
**Default:** `"MIT"`

The license under which the project is released.

**Common licenses:**
- `"MIT"` - Most permissive
- `"Apache-2.0"` - Patent protection
- `"GPL-3.0"` - Copyleft

**Note:** All projects must be open source compatible

---

## Complete Schema

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "type": "tool|art|game|other (required)",
  "category": "string (required)",
  "tags": ["string", "..."] (required, non-empty),
  "authors": ["string", "..."] (required, non-empty),
  "mobile": boolean (required),
  "createdAt": "yyyy-mm-dd (required)",
  "featured": boolean (optional),
  "updatedAt": "yyyy-mm-dd (optional)",
  "license": "string (optional)"
}
```

---

## Validation Process

When you run `npm run collect`, the script validates each `meta.json`:

### Checks Performed

1. **File exists** - `meta.json` must be present
2. **Valid JSON** - Must parse without errors
3. **Required fields** - All required fields present
4. **Type validation** - `type` must be one of the four valid options
5. **Authors array** - Must be non-empty array
6. **Date format** - `createdAt` must match `yyyy-mm-dd`

### Error Messages

If validation fails, you'll see:

```
❌ project-name: Invalid meta.json (missing required fields)
❌ project-name: Invalid type "invalid-type"
❌ project-name: authors must be a non-empty array
❌ project-name: createdAt must be in yyyy-mm-dd format
❌ project-name: Failed to parse meta.json
```

### Success Message

When validation passes:

```
✓ project-name
```

---

## Common Mistakes

### Missing Required Fields

All fields marked as required must be present. Do not leave any as empty strings or null.

### Invalid Type

`type` must be exactly one of: `"tool"`, `"art"`, `"game"`, `"other"`

Case sensitive. No plural forms.

### Authors Not Array

`authors` must always be an array, even for single author:

```json
"authors": ["username"]
```

Not:

```json
"authors": "username"
```

### Wrong Date Format

`createdAt` must be `yyyy-mm-dd`:

```json
"createdAt": "2025-11-26"
```

Not:

```json
"createdAt": "11/26/2025"
"createdAt": "2025-11-26T00:00:00Z"
"createdAt": "Nov 26, 2025"
```

### Extra Commas

JSON does not allow trailing commas:

```json
{
  "title": "Project",
  "description": "Description"  // ← No comma on last item
}
```

---

## Best Practices

### Title Guidelines

- Use proper capitalization
- Be descriptive but concise
- Avoid generic names like "Tool" or "Game"
- Check for name conflicts with existing projects

### Description Guidelines

- Start with what the project does
- Mention key features if space allows
- Avoid personal pronouns
- End with a period

### Tag Selection

- Include the main technology used
- Add relevant domain keywords
- Think about what users would search for
- Avoid overly generic tags like "web" or "javascript"

### Category Selection

- Choose the most specific category that fits
- Be consistent with similar projects
- If unsure, check existing projects of the same type

---

## Workflow

### Creating meta.json

1. Copy template from this document
2. Fill in all required fields
3. Add optional fields if needed
4. Save as `meta.json` in your project directory

### Validating

```bash
npm run collect
```

Look for your project name with a checkmark. If there are errors, fix them and run again.

### Testing

After validation passes, start the dev server:

```bash
npm run dev
```

Visit:
- `/browse` - Your project should appear
- `/explore` - Search for your project
- `/content/your-project-name` - Test the project itself

---

## Integration

### How meta.json is Used

1. **Collection** - `npm run collect` scans all `meta.json` files
2. **Validation** - Each file is validated against the schema
3. **Registry Generation** - Valid projects are compiled into `data/projects.json`
4. **Runtime** - The registry is imported by browse/explore pages

### Generated Registry

Your `meta.json` becomes part of `data/projects.json`:

```json
{
  "slug": "your-project-name",
  "title": "...",
  "description": "...",
  "path": "/your-project-name",
  ...all other fields
}
```

The `slug` and `path` are automatically added based on your directory name.

---

## Troubleshooting

### meta.json not found

Make sure the file is in the correct location:
```
src/app/content/your-project-name/meta.json
```

### JSON parsing error

Use a JSON validator like jsonlint.com to check for syntax errors.

Common issues:
- Missing quotes around keys or values
- Extra commas
- Comments (JSON doesn't support comments)

### Project not showing after validation

1. Check that `data/projects.json` was regenerated
2. Restart the dev server
3. Clear browser cache
4. Check browser console for errors

### Featured not working

The `featured` field requires maintainer approval. Do not set it to `true` in your initial submission.

---

## Reserved Fields

Do not add these fields to your `meta.json` - they are generated automatically:

- `slug` - Generated from directory name
- `path` - Generated as `/${slug}`

---

## Maintenance

### Updating meta.json

When you update your `meta.json`:

1. Make changes
2. Run `npm run collect` to validate
3. Restart dev server
4. Test changes

### When to Update updatedAt

Update this field when:
- Adding major features
- Significant redesign
- Breaking changes

Do not update for:
- Bug fixes
- Minor tweaks
- Documentation updates

---

**Need help?** Check the troubleshooting section or open an issue on GitHub.
