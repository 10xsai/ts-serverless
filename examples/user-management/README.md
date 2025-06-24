# User Management System Example

This example demonstrates how to build a complete user management system using `@10xsai/ts-serverless`. It showcases all the core features including entities, repositories, services, validation, error handling, and API endpoints.

## 🎯 **What You'll Learn**

- Creating entities with business logic
- Implementing repositories with custom queries
- Building services with validation
- Handling errors gracefully
- Creating API endpoints
- Working with Cloudflare Workers and D1

## 📁 **Project Structure**

```
user-management/
├── src/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── repositories/
│   │   └── user.repository.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── schemas/
│   │   └── user.schema.ts
│   ├── handlers/
│   │   └── user.handler.ts
│   ├── database/
│   │   ├── schema.ts
│   │   └── migrations/
│   │       └── 001_create_users.ts
│   └── index.ts
├── package.json
├── wrangler.toml
└── README.md
```

## 🚀 **Getting Started**

### Prerequisites

- Node.js 18+
- Cloudflare account with Workers and D1 enabled
- Wrangler CLI installed

### Installation

```bash
npm install @10xsai/ts-serverless drizzle-orm zod nanoid
npm install -D @types/node typescript wrangler drizzle-kit
```

### Setup Database

```bash
# Create D1 database
wrangler d1 create user-management-db

# Update wrangler.toml with your database ID
# Run initial migration
wrangler d1 execute user-management-db --file=./src/database/migrations/001_create_users.sql
```

## 🏗️ **Implementation**

### 1. Entity Definition

```typescript
// src/entities/user.entity.ts
import { Entity, type EntityId } from "@10xsai/ts-serverless";

export type UserRole = "user" | "admin" | "moderator";
export type UserStatus = "active" | "inactive" | "suspended";

export interface CreateUserData {
  email: string;
  name: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export class User extends Entity {
  public email: string;
  public name: string;
  public role: UserRole;
  public status: UserStatus;
  public lastLoginAt?: Date;
  public loginCount: number;

  constructor(
    data: CreateUserData & {
      id?: EntityId;
      lastLoginAt?: Date;
      loginCount?: number;
    }
  ) {
    super(data.id);
    this.email = data.email;
    this.name = data.name;
    this.role = data.role ?? "user";
    this.status = data.status ?? "active";
    this.lastLoginAt = data.lastLoginAt;
    this.loginCount = data.loginCount ?? 0;
  }

  // Business logic methods
  public updateProfile(name: string, email?: string): void {
    this.name = name;
    if (email) {
      this.email = email;
    }
    this.touch();
  }

  public promoteToAdmin(): void {
    this.role = "admin";
    this.touch();
  }

  public suspend(): void {
    this.status = "suspended";
    this.touch();
  }

  public activate(): void {
    this.status = "active";
    this.touch();
  }

  public recordLogin(): void {
    this.lastLoginAt = new Date();
    this.loginCount += 1;
    this.touch();
  }

  // Business rule checks
  public isAdmin(): boolean {
    return this.role === "admin";
  }

  public canLogin(): boolean {
    return this.status === "active" && !this.deletedAt;
  }

  public isActive(): boolean {
    return this.status === "active";
  }

  // Computed properties
  public getDisplayName(): string {
    return `${this.name} (${this.email})`;
  }

  public getDaysSinceLastLogin(): number | null {
    if (!this.lastLoginAt) return null;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.lastLoginAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
```

### 2. Validation Schemas

```typescript
// src/schemas/user.schema.ts
import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  role: z.enum(["user", "admin", "moderator"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const UpdateUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email too long")
    .optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .optional(),
  role: z.enum(["user", "admin", "moderator"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

export const UserQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  role: z.enum(["user", "admin", "moderator"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  sortBy: z
    .enum(["name", "email", "createdAt", "lastLoginAt"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserQueryInput = z.infer<typeof UserQuerySchema>;
```

### 3. Repository Implementation

```typescript
// src/repositories/user.repository.ts
import {
  BaseRepository,
  type EntityId,
  type FilterCriteria,
  type FindOptions,
  type CreateOptions,
  type UpdateOptions,
  type DeleteOptions,
  type SearchQuery,
  type SearchResult,
  NotFoundError,
  generateId,
} from "@10xsai/ts-serverless";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { eq, like, and, desc, asc, count, or } from "drizzle-orm";
import {
  User,
  type CreateUserData,
  type UpdateUserData,
  type UserRole,
  type UserStatus,
} from "../entities/user.entity";
import { usersTable } from "../database/schema";

export class UserRepository extends BaseRepository<
  User,
  CreateUserData,
  UpdateUserData
> {
  constructor(private db: DrizzleD1Database) {
    super({
      softDelete: true,
      timestamps: true,
      auditTrail: true,
      optimisticLocking: true,
    });
  }

  protected async executeCreate(
    data: CreateUserData,
    options?: CreateOptions
  ): Promise<User> {
    const id = generateId();
    const now = new Date();

    const userData = {
      id,
      email: data.email,
      name: data.name,
      role: data.role ?? "user",
      status: data.status ?? "active",
      loginCount: 0,
      createdAt: now,
      updatedAt: now,
      version: 1,
    };

    await this.db.insert(usersTable).values(userData);

    return new User({
      ...userData,
      id: id as EntityId,
    });
  }

  protected async executeFindById(
    id: EntityId,
    options?: FindOptions
  ): Promise<User | null> {
    const query = this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!options?.withDeleted) {
      query.where(and(eq(usersTable.id, id), eq(usersTable.deletedAt, null)));
    }

    const result = await query.limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.mapToEntity(result[0]);
  }

  protected async executeFindMany(
    criteria: FilterCriteria,
    options?: FindOptions
  ): Promise<User[]> {
    let query = this.db.select().from(usersTable);

    // Apply filters
    const conditions: any[] = [];

    if (!options?.withDeleted) {
      conditions.push(eq(usersTable.deletedAt, null));
    }

    if (criteria.conditions) {
      for (const condition of criteria.conditions) {
        switch (condition.operator) {
          case "eq":
            conditions.push(
              eq(
                usersTable[condition.field as keyof typeof usersTable],
                condition.value
              )
            );
            break;
          case "like":
            conditions.push(
              like(
                usersTable[condition.field as keyof typeof usersTable],
                `%${condition.value}%`
              )
            );
            break;
          // Add more operators as needed
        }
      }
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;
    return results.map((row) => this.mapToEntity(row));
  }

  protected async executeUpdate(
    id: EntityId,
    data: UpdateUserData,
    options?: UpdateOptions
  ): Promise<User> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await this.db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return this.mapToEntity(result[0]);
  }

  protected async executeDelete(
    id: EntityId,
    options?: DeleteOptions
  ): Promise<void> {
    if (this.config.softDelete) {
      await this.db
        .update(usersTable)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, id));
    } else {
      await this.db.delete(usersTable).where(eq(usersTable.id, id));
    }
  }

  protected async executeCount(criteria?: FilterCriteria): Promise<number> {
    let query = this.db.select({ count: count() }).from(usersTable);

    const conditions: any[] = [eq(usersTable.deletedAt, null)];

    if (criteria?.conditions) {
      for (const condition of criteria.conditions) {
        switch (condition.operator) {
          case "eq":
            conditions.push(
              eq(
                usersTable[condition.field as keyof typeof usersTable],
                condition.value
              )
            );
            break;
          case "like":
            conditions.push(
              like(
                usersTable[condition.field as keyof typeof usersTable],
                `%${condition.value}%`
              )
            );
            break;
        }
      }
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;
    return result[0].count;
  }

  protected async executeSearch(
    searchQuery: SearchQuery
  ): Promise<SearchResult<User>> {
    const { term, limit = 10, offset = 0 } = searchQuery;

    const searchConditions = or(
      like(usersTable.name, `%${term}%`),
      like(usersTable.email, `%${term}%`)
    );

    const conditions = and(eq(usersTable.deletedAt, null), searchConditions);

    const [results, countResult] = await Promise.all([
      this.db
        .select()
        .from(usersTable)
        .where(conditions)
        .limit(limit)
        .offset(offset),
      this.db.select({ count: count() }).from(usersTable).where(conditions),
    ]);

    return {
      items: results.map((row) => this.mapToEntity(row)),
      total: countResult[0].count,
      term,
      limit,
      offset,
    };
  }

  // Custom methods
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.email, email), eq(usersTable.deletedAt, null)))
      .limit(1);

    return result.length > 0 ? this.mapToEntity(result[0]) : null;
  }

  async findByRole(
    role: UserRole,
    options?: { limit?: number; offset?: number }
  ): Promise<User[]> {
    const query = this.db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.role, role), eq(usersTable.deletedAt, null)));

    if (options?.limit) {
      query.limit(options.limit);
    }
    if (options?.offset) {
      query.offset(options.offset);
    }

    const results = await query;
    return results.map((row) => this.mapToEntity(row));
  }

  async findActiveUsers(): Promise<User[]> {
    const results = await this.db
      .select()
      .from(usersTable)
      .where(
        and(eq(usersTable.status, "active"), eq(usersTable.deletedAt, null))
      );

    return results.map((row) => this.mapToEntity(row));
  }

  async getLoginStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    recentLogins: number;
  }> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalResult, activeResult, recentResult] = await Promise.all([
      this.db
        .select({ count: count() })
        .from(usersTable)
        .where(eq(usersTable.deletedAt, null)),
      this.db
        .select({ count: count() })
        .from(usersTable)
        .where(
          and(eq(usersTable.status, "active"), eq(usersTable.deletedAt, null))
        ),
      this.db
        .select({ count: count() })
        .from(usersTable)
        .where(
          and(
            eq(usersTable.deletedAt, null)
            // Note: This is a simplified example - you'd need proper date comparison
          )
        ),
    ]);

    return {
      totalUsers: totalResult[0].count,
      activeUsers: activeResult[0].count,
      recentLogins: recentResult[0].count,
    };
  }

  private mapToEntity(row: any): User {
    return new User({
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      status: row.status,
      lastLoginAt: row.lastLoginAt,
      loginCount: row.loginCount,
    });
  }
}
```

### 4. Service Layer

```typescript
// src/services/user.service.ts
import {
  BaseService,
  type EntityId,
  ConflictError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from "@10xsai/ts-serverless";
import {
  User,
  type CreateUserData,
  type UpdateUserData,
  type UserRole,
} from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/user.schema";

export class UserService extends BaseService<
  User,
  CreateUserData,
  UpdateUserData
> {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    super(userRepository);
    this.userRepository = userRepository;
  }

  protected async validateCreate(data: CreateUserData): Promise<void> {
    // Schema validation
    const validation = CreateUserSchema.safeParse(data);
    if (!validation.success) {
      throw new ValidationError("Invalid user data", validation.error.errors);
    }

    // Business rule validation
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError(`User with email ${data.email} already exists`);
    }
  }

  protected async validateUpdate(
    id: EntityId,
    data: UpdateUserData
  ): Promise<void> {
    const validation = UpdateUserSchema.safeParse(data);
    if (!validation.success) {
      throw new ValidationError("Invalid update data", validation.error.errors);
    }

    // Check if user exists
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    // Check email uniqueness if email is being updated
    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictError(`Email ${data.email} is already in use`);
      }
    }
  }

  // Business methods
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async promoteToAdmin(id: EntityId, promotedBy: EntityId): Promise<User> {
    const user = await this.getById(id);

    // Business rule: Only admins can promote users
    const promoter = await this.getById(promotedBy);
    if (!promoter.isAdmin()) {
      throw new ForbiddenError("Only administrators can promote users");
    }

    user.promoteToAdmin();
    return await this.update(id, { role: "admin" });
  }

  async suspendUser(
    id: EntityId,
    suspendedBy: EntityId,
    reason?: string
  ): Promise<User> {
    const user = await this.getById(id);

    // Business rule: Can't suspend admins
    if (user.isAdmin()) {
      throw new ForbiddenError("Cannot suspend administrator accounts");
    }

    // Business rule: Only admins can suspend users
    const suspender = await this.getById(suspendedBy);
    if (!suspender.isAdmin()) {
      throw new ForbiddenError("Only administrators can suspend users");
    }

    user.suspend();
    return await this.update(id, { status: "suspended" });
  }

  async activateUser(id: EntityId): Promise<User> {
    const user = await this.getById(id);
    user.activate();
    return await this.update(id, { status: "active" });
  }

  async recordUserLogin(id: EntityId): Promise<User> {
    const user = await this.getById(id);

    if (!user.canLogin()) {
      throw new ForbiddenError("User account is not active");
    }

    user.recordLogin();
    return await this.update(id, {
      lastLoginAt: new Date(),
      loginCount: user.loginCount,
    });
  }

  async getUsersByRole(
    role: UserRole,
    options?: { limit?: number; offset?: number }
  ): Promise<User[]> {
    return await this.userRepository.findByRole(role, options);
  }

  async getActiveUsers(): Promise<User[]> {
    return await this.userRepository.findActiveUsers();
  }

  async getDashboardStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    recentLogins: number;
    suspendedUsers: number;
  }> {
    const [stats, suspendedUsers] = await Promise.all([
      this.userRepository.getLoginStats(),
      this.userRepository.findMany({
        conditions: [{ field: "status", operator: "eq", value: "suspended" }],
      }),
    ]);

    return {
      ...stats,
      suspendedUsers: suspendedUsers.length,
    };
  }

  async searchUsers(
    term: string,
    limit = 10,
    offset = 0
  ): Promise<{
    users: User[];
    total: number;
  }> {
    const result = await this.userRepository.search({ term, limit, offset });
    return {
      users: result.items,
      total: result.total,
    };
  }
}
```

### 5. API Handlers

```typescript
// src/handlers/user.handler.ts
import {
  createApiResponse,
  handleError,
  type ApiResponse,
  ValidationError,
} from "@10xsai/ts-serverless";
import { UserService } from "../services/user.service";
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserQuerySchema,
} from "../schemas/user.schema";

export class UserHandler {
  constructor(private userService: UserService) {}

  async createUser(request: Request): Promise<Response> {
    try {
      const data = await request.json();
      const user = await this.userService.create(data);
      return createApiResponse.created(user);
    } catch (error) {
      return handleError(error);
    }
  }

  async getUser(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split("/").pop();

      if (!id) {
        return createApiResponse.badRequest("User ID is required");
      }

      const user = await this.userService.getById(id);
      return createApiResponse.success(user);
    } catch (error) {
      return handleError(error);
    }
  }

  async updateUser(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split("/").pop();

      if (!id) {
        return createApiResponse.badRequest("User ID is required");
      }

      const data = await request.json();
      const user = await this.userService.update(id, data);
      return createApiResponse.success(user);
    } catch (error) {
      return handleError(error);
    }
  }

  async deleteUser(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split("/").pop();

      if (!id) {
        return createApiResponse.badRequest("User ID is required");
      }

      await this.userService.delete(id);
      return createApiResponse.success({
        message: "User deleted successfully",
      });
    } catch (error) {
      return handleError(error);
    }
  }

  async listUsers(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const queryParams = Object.fromEntries(url.searchParams);

      const validation = UserQuerySchema.safeParse(queryParams);
      if (!validation.success) {
        throw new ValidationError(
          "Invalid query parameters",
          validation.error.errors
        );
      }

      const { page, limit, search, role, status, sortBy, sortOrder } =
        validation.data;

      let result;
      if (search) {
        const searchResult = await this.userService.searchUsers(
          search,
          limit,
          (page - 1) * limit
        );
        result = {
          data: searchResult.users,
          pagination: {
            page,
            limit,
            total: searchResult.total,
            hasNext: page * limit < searchResult.total,
            hasPrev: page > 1,
          },
        };
      } else {
        const filters: any = {};
        if (role) filters.role = role;
        if (status) filters.status = status;

        result = await this.userService.list({
          page,
          limit,
          filter: filters,
          sort: [{ field: sortBy, direction: sortOrder }],
        });
      }

      return createApiResponse.paginated(result.data, result.pagination);
    } catch (error) {
      return handleError(error);
    }
  }

  async promoteUser(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split("/")[2]; // /users/{id}/promote
      const promotedBy = request.headers.get("X-User-ID"); // In real app, get from auth

      if (!id || !promotedBy) {
        return createApiResponse.badRequest(
          "User ID and promoter ID are required"
        );
      }

      const user = await this.userService.promoteToAdmin(id, promotedBy);
      return createApiResponse.success(user);
    } catch (error) {
      return handleError(error);
    }
  }

  async suspendUser(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const id = url.pathname.split("/")[2]; // /users/{id}/suspend
      const suspendedBy = request.headers.get("X-User-ID");

      if (!id || !suspendedBy) {
        return createApiResponse.badRequest(
          "User ID and suspender ID are required"
        );
      }

      const body = await request.json();
      const user = await this.userService.suspendUser(
        id,
        suspendedBy,
        body.reason
      );
      return createApiResponse.success(user);
    } catch (error) {
      return handleError(error);
    }
  }

  async getUserStats(request: Request): Promise<Response> {
    try {
      const stats = await this.userService.getDashboardStats();
      return createApiResponse.success(stats);
    } catch (error) {
      return handleError(error);
    }
  }
}
```

## 🚀 **Usage Examples**

### Creating a User

```bash
curl -X POST https://your-worker.workers.dev/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "name": "John Doe",
    "role": "user"
  }'
```

### Getting a User

```bash
curl https://your-worker.workers.dev/users/user_123
```

### Listing Users with Filters

```bash
curl "https://your-worker.workers.dev/users?page=1&limit=10&role=admin&sortBy=createdAt&sortOrder=desc"
```

### Searching Users

```bash
curl "https://your-worker.workers.dev/users?search=john&limit=5"
```

### Promoting a User

```bash
curl -X POST https://your-worker.workers.dev/users/user_123/promote \
  -H "X-User-ID: admin_456"
```

## 📊 **Key Features Demonstrated**

1. **Entity Business Logic**: User entity with business methods
2. **Repository Pattern**: Custom queries and data access
3. **Service Layer**: Business rules and validation
4. **Error Handling**: Proper error types and context
5. **Validation**: Schema-based input validation
6. **Security**: Role-based operations
7. **Performance**: Efficient queries and pagination
8. **API Design**: RESTful endpoints with proper responses

This example shows how to build a production-ready user management system using the core framework's enterprise patterns while maintaining optimal performance for serverless environments.
