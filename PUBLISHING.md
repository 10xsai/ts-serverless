# Publishing Guide for @my-org/ts-serverless

This guide walks you through publishing the `@my-org/ts-serverless` package to npm.

## Pre-Publishing Checklist

✅ **Package Configuration**

- [x] Updated `package.json` with proper npm fields
- [x] Added `LICENSE` file (MIT)
- [x] Added `.npmignore` to exclude development files
- [x] Set up proper exports and build configuration
- [x] Added publishing scripts

✅ **Build & Validation**

- [x] Package builds successfully with `nx build @my-org/ts-serverless`
- [x] Package contents validated with `npm pack --dry-run`
- [x] Total package size: 41.8 kB (unpacked: 201.2 kB)
- [x] 108 files included in the package

## Publishing Steps

### 1. Prerequisites

Ensure you have:

- An npm account with publishing permissions
- Access to publish under the `@my-org` scope
- Node.js >= 18.0.0 installed

### 2. Authentication

Login to npm if you haven't already:

```bash
npm login
```

Verify you're logged in:

```bash
npm whoami
```

### 3. Final Build

Ensure the package is built with the latest changes:

```bash
# From workspace root
nx build @my-org/ts-serverless

# Or from package directory
cd packages/ts-serverless
npm run build
```

### 4. Version Management

The package is currently at version `0.1.0`. For future releases:

```bash
# Patch release (0.1.0 -> 0.1.1)
npm version patch

# Minor release (0.1.0 -> 0.2.0)
npm version minor

# Major release (0.1.0 -> 1.0.0)
npm version major
```

### 5. Publish to npm

#### Option A: Direct Publish

```bash
cd packages/ts-serverless
npm publish
```

#### Option B: Using Nx (Recommended)

```bash
# From workspace root
nx run @my-org/ts-serverless:nx-release-publish
```

#### Option C: Dry Run First

```bash
cd packages/ts-serverless
npm publish --dry-run
```

### 6. Verify Publication

After publishing, verify the package:

```bash
npm view @my-org/ts-serverless
```

Install it in a test project:

```bash
npm install @my-org/ts-serverless
```

## Package Details

### What's Included

- Complete TypeScript definitions
- Built JavaScript files (ES modules)
- Source maps for debugging
- README.md with comprehensive documentation
- LICENSE file

### What's Excluded (via .npmignore)

- Source TypeScript files
- Test files
- Development configuration
- Build artifacts (\*.tsbuildinfo)
- Documentation files (except README)

### Package Metadata

- **Name**: `@my-org/ts-serverless`
- **Version**: `0.1.0`
- **License**: MIT
- **Main**: `./dist/index.js`
- **Types**: `./dist/index.d.ts`
- **Node.js Requirement**: >= 18.0.0

## Post-Publishing

### 1. Update Documentation

- Update any references to the package in other documentation
- Create release notes
- Update the main README if needed

### 2. Tag the Git Release

```bash
git tag v0.1.0
git push origin v0.1.0
```

### 3. Notify Stakeholders

- Announce the release to the team
- Update any dependent packages
- Update examples and documentation

## Troubleshooting

### Authentication Issues

```bash
npm logout
npm login
```

### Permission Errors

Ensure you have permission to publish under the `@my-org` scope:

```bash
npm access list packages @my-org
```

### Build Issues

Clean and rebuild:

```bash
nx reset
nx build @my-org/ts-serverless
```

### Version Conflicts

If the version already exists:

```bash
npm version patch
npm publish
```

## Support

For issues with publishing, contact the X42AI development team or check:

- [npm documentation](https://docs.npmjs.com/)
- [Nx publishing guide](https://nx.dev/recipes/nx-release/publish-libraries)
