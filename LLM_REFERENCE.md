# @10xsai/ts-serverless - LLM Reference Guide

This is a comprehensive reference guide for Large Language Models to understand and use the `@10xsai/ts-serverless` library effectively.

## 🎯 Framework Overview

`@10xsai/ts-serverless` is an enterprise-grade TypeScript framework built with Drizzle ORM, optimized for Cloudflare Workers and serverless environments. It provides a complete foundation for building scalable, type-safe applications with consistent patterns.

## 🏗 Core Architecture

### Main Modules

- **Base**: Entity, Repository, Service base classes
- **Database**: Connection management, migrations, schema handling
- **Validation**: Zod-based validation utilities and schemas
- **Errors**: Comprehensive error handling system
- **Query**: Query building and filtering capabilities
- **Security**: Input sanitization and validation
- **Utils**: Helper functions and response utilities

## 📦 Installation & Import

```typescript
// Install the framework
npm install @10xsai/ts-serverless drizzle-orm zod nanoid

// Main import pattern
import {
  // Base classes
  Entity, BaseRepository, BaseService,

  // Database
  ConnectionManager, DatabaseAdapter,

  // Validation
  validators, validate, BaseEntitySchema,

  // Errors
  BaseError, ValidationError, NotFoundError,

  // Query
  BaseQueryBuilder, FilterBuilder,

  // Security
  sanitizeInput, validateSecureString,

  // Utils
  createResponse, generateId, retryOperation,

  // Types
  type EntityId, type BaseEntity, type PaginationOptions
} from '@10xsai/ts-serverless';
```

## 🎨 Core Patterns & Usage Examples

### 1. Creating Entities

```typescript
import { Entity, type EntityId } from "@10xsai/ts-serverless";

// Define your entity class
export class User extends Entity {
  public email: string;
  public name: string;
  public role: "user" | "admin";
  public status: "active" | "inactive";

  constructor(data: {
    id?: EntityId;
    email: string;
    name: string;
    role?: "user" | "admin";
    status?: "active" | "inactive";
  }) {
    super(data.id);
    this.email = data.email;
    this.name = data.name;
    this.role = data.role ?? "user";
    this.status = data.status ?? "active";
  }

  // Business logic methods
  public updateProfile(name: string, email?: string): void {
    this.name = name;
    if (email) this.email = email;
    this.touch(); // Updates the updatedAt timestamp
  }

  public activate(): void {
    this.status = "active";
    this.touch();
  }

  public deactivate(): void {
    this.status = "inactive";
    this.touch();
  }

  // Business rule checks
  public canLogin(): boolean {
    return this.status === "active" && !this.deletedAt;
  }

  public isAdmin(): boolean {
    return this.role === "admin";
  }
}
```

### 2. Repository Pattern

```typescript
import {
  BaseRepository,
  type PaginationOptions,
  type FilterCriteria,
} from "@10xsai/ts-serverless";
import { eq, like, and } from "drizzle-orm";

export class UserRepository extends BaseRepository<User> {
  protected entityName = "User";

  constructor(db: any) {
    super(db, usersTable); // usersTable is your Drizzle schema
  }

  // Custom queries
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.email, email))
      .limit(1);

    return result[0] ? this.mapToEntity(result[0]) : null;
  }

  async findActiveUsers(options?: PaginationOptions): Promise<User[]> {
    const query = this.db
      .select()
      .from(this.table)
      .where(
        and(eq(this.table.status, "active"), this.buildSoftDeleteFilter())
      );

    if (options) {
      query.limit(options.limit ?? 10).offset(options.offset ?? 0);
    }

    const results = await query;
    return results.map((r) => this.mapToEntity(r));
  }

  // Map database row to entity
  protected mapToEntity(row: any): User {
    return new User({
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      status: row.status,
    });
  }

  // Map entity to database row
  protected mapToRow(entity: User): any {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      role: entity.role,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      version: entity.version,
    };
  }
}
```

### 3. Service Layer

```typescript
import {
  BaseService,
  ValidationError,
  NotFoundError,
} from "@10xsai/ts-serverless";
import { z } from "zod";

// Validation schemas
const CreateUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  role: z.enum(["user", "admin"]).optional(),
});

const UpdateUserSchema = CreateUserSchema.partial();

export class UserService extends BaseService {
  constructor(private userRepository: UserRepository) {
    super();
  }

  async createUser(data: unknown): Promise<User> {
    // Validate input
    const validatedData = await this.validateInput(CreateUserSchema, data);

    // Check business rules
    const existingUser = await this.userRepository.findByEmail(
      validatedData.email
    );
    if (existingUser) {
      throw new ValidationError("Email already exists", {
        field: "email",
        value: validatedData.email,
      });
    }

    // Create entity
    const user = new User(validatedData);

    // Save to database
    const savedUser = await this.userRepository.create(user);

    return savedUser;
  }

  async updateUser(id: string, data: unknown): Promise<User> {
    // Validate input
    const validatedData = await this.validateInput(UpdateUserSchema, data);

    // Find existing user
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found", { entityId: id });
    }

    // Apply updates
    if (validatedData.name) user.updateProfile(validatedData.name);
    if (validatedData.email) user.updateProfile(user.name, validatedData.email);
    if (validatedData.role) user.role = validatedData.role;

    // Save changes
    const updatedUser = await this.userRepository.update(user);

    return updatedUser;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found", { entityId: id });
    }
    return user;
  }

  async listUsers(options?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<{ users: User[]; total: number }> {
    const paginationOptions = {
      page: options?.page ?? 1,
      limit: options?.limit ?? 10,
      offset: ((options?.page ?? 1) - 1) * (options?.limit ?? 10),
    };

    // Build filters
    const filters: FilterCriteria = {
      conditions: [],
      logic: "AND",
    };

    if (options?.search) {
      filters.conditions?.push({
        field: "name",
        operator: "ilike",
        value: `%${options.search}%`,
      });
    }

    if (options?.role) {
      filters.conditions?.push({
        field: "role",
        operator: "eq",
        value: options.role,
      });
    }

    const users = await this.userRepository.findMany({
      ...paginationOptions,
      filter: filters,
    });

    const total = await this.userRepository.count(filters);

    return { users, total };
  }
}
```

### 4. API Handlers (Cloudflare Workers)

```typescript
import { createResponse, handleError } from "@10xsai/ts-serverless";

export async function handleUserRequests(
  request: Request,
  env: any
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Initialize dependencies
    const db = new DatabaseAdapter(env.DB);
    const userRepository = new UserRepository(db);
    const userService = new UserService(userRepository);

    // Route handling
    if (method === "POST" && path === "/users") {
      const body = await request.json();
      const user = await userService.createUser(body);
      return createResponse({ success: true, data: user }, 201);
    }

    if (method === "GET" && path.startsWith("/users/")) {
      const id = path.split("/")[2];
      const user = await userService.getUserById(id);
      return createResponse({ success: true, data: user });
    }

    if (method === "PUT" && path.startsWith("/users/")) {
      const id = path.split("/")[2];
      const body = await request.json();
      const user = await userService.updateUser(id, body);
      return createResponse({ success: true, data: user });
    }

    if (method === "GET" && path === "/users") {
      const searchParams = url.searchParams;
      const options = {
        page: parseInt(searchParams.get("page") ?? "1"),
        limit: parseInt(searchParams.get("limit") ?? "10"),
        search: searchParams.get("search") ?? undefined,
        role: searchParams.get("role") ?? undefined,
      };

      const result = await userService.listUsers(options);
      return createResponse({
        success: true,
        data: result.users,
        pagination: {
          page: options.page,
          limit: options.limit,
          total: result.total,
          hasNext: result.total > options.page * options.limit,
          hasPrev: options.page > 1,
        },
      });
    }

    return createResponse({ success: false, error: "Not found" }, 404);
  } catch (error) {
    return handleError(error);
  }
}
```

## 🔧 Complete API Reference

### Type Exports

```typescript
// ID Types
type EntityId = Brand<string, "EntityId">;
type UserId = Brand<string, "UserId">;
type TenantId = Brand<string, "TenantId">;
type TraceId = Brand<string, "TraceId">;

// Entity Types
interface BaseEntity {
  id: EntityId;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: UserId;
  updatedBy?: UserId;
  version: number;
  deletedAt?: Date;
  metadata?: Record<string, unknown>;
}

// Options Types
interface CreateOptions {
  skipValidation?: boolean;
  skipEvents?: boolean;
  auditTrail?: boolean;
  metadata?: Record<string, unknown>;
}

interface UpdateOptions extends CreateOptions {
  optimisticLocking?: boolean;
  partial?: boolean;
}

interface ListOptions {
  page?: number;
  limit?: number;
  offset?: number;
  sort?: SortCriteria[];
  filter?: FilterCriteria;
  search?: SearchQuery;
  include?: string[];
  exclude?: string[];
  withDeleted?: boolean;
}

// Query Types
interface FilterCriteria {
  conditions?: FilterCondition[];
  logic?: "AND" | "OR";
  groups?: FilterCriteria[];
}

interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value?: unknown;
  values?: unknown[];
}

type FilterOperator =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "like"
  | "ilike"
  | "startsWith"
  | "endsWith"
  | "contains"
  | "in"
  | "notIn"
  | "isNull"
  | "isNotNull"
  | "between";
```

## 💡 Best Practices for LLMs

### 1. Always Use Type Safety

```typescript
// Good: Use branded types
const userId: UserId = createUserId("user_123");

// Good: Use proper interfaces
interface CreateUserRequest {
  email: string;
  name: string;
  role?: "user" | "admin";
}
```

### 2. Follow Entity-Repository-Service Pattern

```typescript
// Entity: Business logic and rules
class User extends Entity {
  /* ... */
}

// Repository: Data access
class UserRepository extends BaseRepository<User> {
  /* ... */
}

// Service: Business operations
class UserService extends BaseService {
  /* ... */
}
```

### 3. Validate All Inputs

```typescript
// Always validate inputs at service boundaries
const validatedData = await this.validateInput(CreateUserSchema, inputData);
```

### 4. Handle Errors Consistently

```typescript
// Use framework error types
throw new ValidationError("Invalid email", { field: "email" });
throw new NotFoundError("User not found", { entityId: id });
```

### 5. Use Proper Response Format

```typescript
// Consistent API responses
return createResponse({
  success: true,
  data: result,
  message: "Operation completed successfully",
});
```

## 🚀 Quick Start Template

When creating a new service with this framework, follow this template:

```typescript
// 1. Define entity
export class YourEntity extends Entity {
  // properties and methods
}

// 2. Create repository
export class YourRepository extends BaseRepository<YourEntity> {
  // custom queries
}

// 3. Build service
export class YourService extends BaseService {
  // business operations with validation
}

// 4. Create API handler
export async function handleRequests(request: Request): Promise<Response> {
  // routing and error handling
}
```

This framework provides everything you need to build enterprise-grade applications with consistent patterns, type safety, and proper error handling.
