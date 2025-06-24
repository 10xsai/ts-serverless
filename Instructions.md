# Create Enterprise-Grade Core Framework in Nx Monorepo

## Context & Background

I have an existing `core-service` implementation that has consistency issues and debugging complexity. I need you to create a new, superior `ts-serverless` service using the same functional requirements but with enterprise-grade standards, consistency, and zero errors.

## Project Setup Requirements

### Nx Monorepo Structure
```bash
# Create new library in existing Nx workspace
nx generate @nx/node:library ts-serverless --buildable --publishable --importPath=@myorg/ts-serverless
```

### Target Structure (Cloudflare Workers Optimized)
```
libs/
└── ts-serverless/
    ├── src/
    │   ├── lib/
    │   │   ├── base/           # Base entities and repositories
    │   │   ├── database/       # Drizzle connection and schema utils
    │   │   ├── validation/     # Input validation (lightweight)
    │   │   ├── errors/         # Error handling system
    │   │   ├── query/          # Query builder and filtering
    │   │   ├── security/       # Input sanitization (serverless-safe)
    │   │   ├── utils/          # Core utilities and helpers
    │   │   └── index.ts        # Main exports
    │   └── index.ts            # Library entry point
    ├── project.json
    ├── tsconfig.json
    ├── tsconfig.lib.json
    └── README.md
```

## Serverless-Optimized Implementation Focus

### **Include (Essential for Serverless)**
1. **Core Base System** - Lightweight entity and repository patterns
2. **Database Layer** - Drizzle ORM with connection pooling for serverless
3. **Advanced Query System** - Efficient filtering, pagination, search
4. **Validation Framework** - Fast input validation without heavy dependencies
5. **Error Handling** - Structured error responses
6. **Security Basics** - Input sanitization and basic protection
7. **Response Utilities** - Consistent API response formatting

### **Exclude/Minimize (Not Optimal for Serverless)**
- ❌ **Complex Event Systems** - Keep simple, avoid heavy pub/sub
- ❌ **File System Operations** - No local file operations
- ❌ **Heavy Monitoring** - Lightweight logging only
- ❌ **Complex Caching** - Use simple in-memory caching only
- ❌ **Background Processing** - No long-running processes
- ❌ **Node.js Specific APIs** - Use only Web APIs

## Implementation Requirements

### 1. **CRITICAL: Implement with ZERO Errors**
- Every file must compile without TypeScript errors
- All imports/exports must be properly resolved
- No circular dependencies
- All types must be properly defined and exported
- Complete implementation - no TODO comments or placeholders

### 2. **Cloudflare Workers Optimization**
- **Lightweight Implementation**: No Node.js specific dependencies
- **Fast Cold Starts**: Minimal initialization overhead
- **Memory Efficient**: Optimized for 128MB memory limit
- **Edge Runtime Compatible**: Use only Web APIs and Worker APIs
- **Bundle Size Conscious**: Tree-shakeable modules for minimal bundle size

### 3. **Consistency Standards**
- **Naming Convention**: Use consistent PascalCase for classes, camelCase for functions/variables, UPPER_CASE for constants
- **File Structure**: Every module should follow the same pattern (types → interfaces → implementations → exports)
- **Import Organization**: Group imports (external → internal → relative) with consistent ordering
- **Error Handling**: Use the same error patterns across all modules
- **Type Definitions**: Consistent generic patterns and constraint usage

### 4. **Code Quality Requirements**
- **TypeScript Strict Mode**: Enable all strict options
- **Complete Type Safety**: No `any` types unless absolutely necessary
- **Proper Generics**: Use constraints and conditional types appropriately
- **JSDoc Documentation**: Every public method and class must have complete documentation
- **Consistent Formatting**: Use Prettier-compatible formatting

### 5. **Serverless Architecture Standards**
- **Stateless Design**: No persistent state between requests
- **Functional Approach**: Prefer pure functions over stateful classes where possible
- **Efficient Resource Usage**: Minimize CPU and memory consumption
- **Fast Execution**: Optimize critical paths for sub-50ms execution

## Specific Implementation Instructions

### Reference the Provided Technical Specification (Serverless Focused)
Use the technical specification as your blueprint, but implement only serverless-optimized features:

1. **Universal Base Entity Schema** - Lightweight version with essential fields
2. **Repository Pattern** - Drizzle-based repository with connection pooling
3. **Service Layer** - Stateless service pattern optimized for Workers
4. **Advanced Query System** - Efficient filtering and pagination
5. **Streamlined Error Handling** - Fast error responses without heavy logging
6. **Input Validation** - Lightweight validation without external dependencies
7. **Basic Security** - Essential sanitization and protection
8. **Response Formatting** - Consistent API responses

### Cloudflare Workers Specific Optimizations

#### Database Connection
- **Connection Pooling**: Optimize for serverless connection patterns
- **Edge-First Design**: Minimize database round trips
- **Prepared Statements**: Use prepared statements for performance

#### Memory Management
- **Lazy Loading**: Initialize only what's needed
- **Efficient Serialization**: Optimize JSON operations
- **Garbage Collection**: Minimize object creation in hot paths

#### Performance Patterns
- **Fast Startup**: Sub-10ms cold start contribution
- **Efficient Bundling**: Tree-shakeable exports
- **Worker-Specific APIs**: Use `Request`/`Response` objects directly

### Key Success Criteria

#### ✅ **Must Have - Zero Compromise**
- [ ] Every TypeScript file compiles without errors
- [ ] All imports resolve correctly
- [ ] Complete type safety throughout
- [ ] Consistent code patterns across all modules
- [ ] Proper error handling in every operation
- [ ] Complete JSDoc documentation
- [ ] All interfaces properly defined and exported
- [ ] Working examples that demonstrate all features
- [ ] **Cloudflare Workers compatible** - No Node.js dependencies
- [ ] **Fast execution** - Optimized for serverless performance

#### ✅ **Code Consistency Checklist**
- [ ] Identical error handling patterns across all services
- [ ] Same generic type patterns used consistently
- [ ] Uniform response formatting
- [ ] Consistent validation approach across all modules
- [ ] Identical database operation patterns
- [ ] Same connection management patterns
- [ ] Uniform type definitions and exports

#### ✅ **Serverless Standards**
- [ ] Edge-runtime compatible code only
- [ ] Efficient memory usage patterns
- [ ] Fast cold start optimization
- [ ] Stateless design throughout
- [ ] Connection pooling for database
- [ ] Tree-shakeable module exports
- [ ] Web API compatibility

## Implementation Strategy

### Phase 1: Serverless Foundation
1. Create base entity and repository abstractions (lightweight)
2. Implement error handling system
3. Set up validation framework (no external deps)
4. Create core type definitions

### Phase 2: Database & Query Layer
1. Build Drizzle-based repository classes
2. Implement advanced query system (filtering, pagination)
3. Add connection management (serverless-optimized)
4. Create response utilities

### Phase 3: Security & Validation
1. Add input sanitization
2. Implement validation patterns
3. Create security utilities (serverless-safe)
4. Add basic protection mechanisms

### Phase 4: Integration & Examples
1. Create working Cloudflare Workers examples
2. Add comprehensive usage documentation
3. Verify serverless compatibility
4. Optimize for performance

## Technical Stack Confirmation
- **TypeScript 5.0+** with strict configuration
- **Drizzle ORM** with PostgreSQL (serverless-optimized)
- **Cloudflare Workers** runtime (primary target)
- **Nx Monorepo** structure
- **Web APIs only** - No Node.js dependencies
- **Edge-compatible** patterns and practices

## Expected Deliverables

### 1. Complete Implementation
- All modules implemented with zero errors
- Working examples demonstrating all features
- Complete type definitions and exports
- Proper Nx library configuration

### 2. Documentation
- Comprehensive README with usage examples
- API documentation for all public interfaces
- Architecture decisions and patterns explained
- Migration guide from legacy implementations

### 3. Quality Assurance
- TypeScript compilation with zero errors
- Consistent code patterns verified
- All imports and exports working
- Complete feature functionality confirmed

## Success Validation

Before considering the implementation complete, verify:

1. **`nx build ts-serverless`** - Builds without any errors
2. **All exports accessible** - Can import and use all features
3. **Examples work** - All provided examples execute successfully
4. **Types resolve** - IntelliSense shows proper type information
5. **Documentation complete** - Every public API documented
6. **Patterns consistent** - Same patterns used throughout codebase

## Final Notes

- **Quality over Speed**: Take time to ensure every file is perfect
- **Reference Implementation**: Use the existing core-service as a reference for functionality, but implement with superior architecture
- **Enterprise Focus**: This will be used in production environments
- **Maintainability**: Code must be easily understood and extended by other developers
- **Zero Technical Debt**: No shortcuts or workarounds that create future problems

Create a world-class framework that becomes the gold standard for TypeScript/Drizzle enterprise applications.