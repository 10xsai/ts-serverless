# How to Use @10xsai/ts-serverless as LLM Reference

This guide explains the best practices for providing the `@10xsai/ts-serverless` as reference to Large Language Models for creating new libraries or applications.

## 🎯 Overview

When you want to create a new library that uses the core framework, you need to provide comprehensive context to the LLM. This framework has been designed with LLM consumption in mind, following consistent patterns and providing clear documentation.

## 📋 What to Include in Your LLM Prompt

### 1. Core Framework Reference Files

Always include these files in your context:

```
packages/ts-serverless/
├── LLM_REFERENCE.md         # Main usage guide with examples
├── API_REFERENCE.md         # Complete API documentation
├── README.md               # Overview and quick start
├── docs/
│   ├── getting-started.md  # Step-by-step tutorial
│   └── architecture.md     # Framework architecture
└── examples/
    └── user-management/    # Complete working example
        └── README.md
```

### 2. Package Information

Include the package.json to show dependencies and structure:

```json
{
  "name": "@10xsai/ts-serverless",
  "version": "0.0.1",
  "dependencies": {
    "drizzle-orm": "^0.44.2",
    "zod": "^3.22.4",
    "nanoid": "^5.0.4",
    "tslib": "^2.3.0"
  },
  "keywords": [
    "typescript",
    "drizzle",
    "orm",
    "cloudflare-workers",
    "enterprise",
    "framework",
    "database",
    "serverless",
    "edge-runtime"
  ]
}
```

### 3. Key Framework Modules

Share the main export structure:

```typescript
// Core exports available from '@10xsai/ts-serverless'
export {
  // Base classes
  Entity,
  BaseRepository,
  BaseService,

  // Database
  ConnectionManager,
  DatabaseAdapter,

  // Validation
  validators,
  validate,
  BaseEntitySchema,

  // Errors
  BaseError,
  ValidationError,
  NotFoundError,

  // Query
  BaseQueryBuilder,
  FilterBuilder,

  // Security
  sanitizeInput,
  validateSecureString,

  // Utils
  createResponse,
  generateId,
  retryOperation,

  // Types
  type EntityId,
  type BaseEntity,
  type PaginationOptions,
} from "@10xsai/ts-serverless";
```

## 🚀 Sample LLM Prompt Template

Here's a template for requesting a new library based on the core framework:

```markdown
I want to create a new library called `@10xsai/[YOUR_LIBRARY]` that uses the `@10xsai/ts-serverless`.

**Requirements:**

- [Describe your specific use case]
- Follow the same patterns as the core framework
- Use TypeScript with strict typing
- Optimized for Cloudflare Workers
- Include comprehensive tests
- Follow the Entity-Repository-Service pattern

**Reference Materials:**
[Include the LLM_REFERENCE.md content here]

**Core Framework API:**
[Include the API_REFERENCE.md content here]

**Example Implementation:**
[Include the user-management example README.md here]

**Specific Requirements:**

1. Create entities for: [list your entities]
2. Implement repositories with custom queries for: [list requirements]
3. Build services with business logic for: [list operations]
4. Include validation schemas for all inputs
5. Handle errors consistently using framework error types
6. Create API handlers for Cloudflare Workers

**Architecture:**
Follow the proven architecture pattern:
```

src/
├── entities/ # Domain entities extending Entity
├── repositories/ # Data access extending BaseRepository  
├── services/ # Business logic extending BaseService
├── schemas/ # Zod validation schemas
├── handlers/ # API route handlers
├── types/ # TypeScript type definitions
└── index.ts # Main exports

```

Please implement this following all the patterns and best practices from the core framework.
```

## 📝 Best Practices for LLM Interaction

### 1. Be Specific About Patterns

Always emphasize these framework patterns:

- **Entity-Repository-Service Architecture**
- **Type Safety with Brand Types**
- **Comprehensive Validation**
- **Consistent Error Handling**
- **Cloudflare Workers Optimization**

### 2. Provide Complete Context

Include these sections from the reference materials:

```markdown
## Framework Patterns

[Copy the relevant sections from LLM_REFERENCE.md]

## API Reference

[Copy the relevant sections from API_REFERENCE.md]

## Working Example

[Copy a complete example showing the pattern]

## Requirements

[Your specific requirements]
```

### 3. Request Specific Structure

Ask the LLM to follow this structure:

```typescript
// 1. Define your domain entities
export class YourEntity extends Entity {
  // Properties and business logic methods
}

// 2. Create repositories for data access
export class YourRepository extends BaseRepository<YourEntity> {
  // Custom queries and data operations
}

// 3. Build services for business operations
export class YourService extends BaseService {
  // Business logic with validation and error handling
}

// 4. Create API handlers
export async function handleRequests(request: Request): Promise<Response> {
  // Route handling with proper error responses
}
```

### 4. Emphasize Quality Standards

Request these quality aspects:

- **Zero TypeScript errors**
- **Complete JSDoc documentation**
- **Comprehensive error handling**
- **Input validation for all operations**
- **Consistent naming conventions**
- **Enterprise-grade code quality**

## 🔧 Advanced Usage Scenarios

### For Complex Business Domains

When creating libraries for complex domains:

```markdown
Context: I'm building a [DOMAIN] management system using @10xsai/ts-serverless.

Domain Requirements:

- Entities: [List with relationships]
- Business Rules: [Specific rules and constraints]
- Operations: [CRUD and complex operations]
- Integrations: [External services]

Please follow the core framework patterns and create:

1. Proper entity hierarchy with business logic
2. Repository layer with complex queries
3. Service layer with business rule validation
4. API layer with proper error handling
```

### For Microservice Architecture

When building microservices:

```markdown
Context: Creating a microservice using @10xsai/ts-serverless for Cloudflare Workers.

Service Requirements:

- Single responsibility: [specific purpose]
- API endpoints: [list endpoints]
- Data storage: [D1/external]
- Authentication: [requirements]
- Rate limiting: [requirements]

Architecture: Follow the core framework patterns with service-specific customizations.
```

### For Event-Driven Systems

When building event-driven systems:

```markdown
Context: Building an event-driven service with @10xsai/ts-serverless.

Event Requirements:

- Event types: [list events]
- Event handlers: [processing requirements]
- Event storage: [audit trail needs]
- Integration patterns: [pub/sub, webhooks]

Pattern: Extend the base framework with event handling capabilities while maintaining the core patterns.
```

## ✅ Validation Checklist

When receiving LLM output, verify:

- [ ] Uses proper imports from `@10xsai/ts-serverless`
- [ ] Extends base classes correctly (Entity, BaseRepository, BaseService)
- [ ] Implements proper TypeScript types with brand types
- [ ] Includes comprehensive validation schemas
- [ ] Uses framework error types consistently
- [ ] Follows the established naming conventions
- [ ] Includes proper JSDoc documentation
- [ ] Optimized for Cloudflare Workers
- [ ] Includes comprehensive error handling
- [ ] Follows the Entity-Repository-Service pattern

## 🎨 Customization Guidelines

The framework is designed to be extended, not modified. When requesting customizations:

### Acceptable Extensions

- Custom entity types with additional business logic
- Specialized repositories with domain-specific queries
- Service layer extensions for complex business rules
- Custom validation rules and schemas
- Specialized error types for domain-specific cases

### Discouraged Modifications

- Changing base class interfaces
- Modifying core validation logic
- Altering error handling patterns
- Breaking TypeScript strict typing
- Removing security features

## 🚀 Getting Started Template

Use this template to get started quickly:

````markdown
# [Your Library Name]

Built with `@10xsai/ts-serverless` following enterprise patterns.

## Installation

```bash
npm install @10xsai/[your-library] @10xsai/ts-serverless
```
````

## Quick Start

```typescript
import { [YourService] } from '@10xsai/[your-library]';

// Initialize service
const service = new [YourService](dependencies);

// Use the service
const result = await service.[operation](data);
```

## Architecture

Follows the proven Entity-Repository-Service pattern:

- Entities: Business domain objects with rules
- Repositories: Data access layer
- Services: Business operations layer
- Handlers: API endpoint layer

## API Reference

[Generated from your implementation]

```

This approach ensures that LLMs have complete context to create high-quality, consistent libraries that properly leverage the core framework's capabilities.
```
