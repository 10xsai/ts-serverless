# Getting Started with @10xsai/ts-serverless

Welcome to `@10xsai/ts-serverless`! This guide will help you get up and running quickly with the framework, whether you're building a simple API or a complex enterprise application.

## 📋 **Prerequisites**

- **Node.js**: Version 18+
- **TypeScript**: Version 5.0+
- **Package Manager**: npm, pnpm, or yarn
- **Runtime**: Cloudflare Workers (recommended) or Node.js

## 🚀 **Installation**

### Install the Framework

```bash
# Using npm
npm install @10xsai/ts-serverless

# Using pnpm (recommended)
pnpm add @10xsai/ts-serverless

# Using yarn
yarn add @10xsai/ts-serverless
```

### Peer Dependencies

The framework requires these peer dependencies:

```bash
pnpm add drizzle-orm zod nanoid
```

## 🏗️ **Project Structure**

Here's a recommended project structure for your application:

```
my-app/
├── src/
│   ├── entities/           # Domain entities
│   │   ├── user.entity.ts
│   │   └── index.ts
│   ├── repositories/       # Data access layer
│   │   ├── user.repository.ts
│   │   └── index.ts
│   ├── services/          # Business logic layer
│   │   ├── user.service.ts
│   │   └── index.ts
│   ├── schemas/           # Validation schemas
│   │   ├── user.schema.ts
│   │   └── index.ts
│   ├── database/          # Database configuration
│   │   ├── schema.ts
│   │   └── migrations/
│   └── index.ts           # Main application entry
├── wrangler.toml          # Cloudflare Workers config
└── package.json
```

## 🎯 **Your First Application**

Let's build a simple user management API step by step.

### **Step 1: Define Your Entity**

```typescript
// src/entities/user.entity.ts
import { Entity, type EntityId } from "@10xsai/ts-serverless";

export interface CreateUserData {
  email: string;
  name: string;
  role?: "user" | "admin";
}

export interface UpdateUserData {
  name?: string;
  role?: "user" | "admin";
}

export class User extends Entity {
  public email: string;
  public name: string;
  public role: "user" | "admin";

  constructor(data: CreateUserData & { id?: EntityId }) {
    super(data.id);
    this.email = data.email;
    this.name = data.name;
    this.role = data.role ?? "user";
  }

  public updateName(name: string): void {
    this.name = name;
    this.touch(); // Updates the updatedAt timestamp
  }

  public promoteToAdmin(): void {
    this.role = "admin";
    this.touch();
  }

  public isAdmin(): boolean {
    return this.role === "admin";
  }
}
```

### **Step 2: Create Validation Schemas**

```typescript
// src/schemas/user.schema.ts
import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  role: z.enum(["user", "admin"]).optional(),
});

export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export const UserIdSchema = z.string().min(1, "User ID is required");

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
```

### **Step 3: Implement Repository**

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
} from "@10xsai/ts-serverless";
import {
  User,
  type CreateUserData,
  type UpdateUserData,
} from "../entities/user.entity";

export class UserRepository extends BaseRepository<
  User,
  CreateUserData,
  UpdateUserData
> {
  // This would be injected in a real application
  private db: any; // Your Drizzle database instance

  constructor(db: any) {
    super({
      softDelete: true,
      timestamps: true,
      auditTrail: true,
    });
    this.db = db;
  }

  protected async executeCreate(
    data: CreateUserData,
    options?: CreateOptions
  ): Promise<User> {
    // Example with Drizzle ORM
    const result = await this.db
      .insert(usersTable)
      .values({
        id: generateId(),
        email: data.email,
        name: data.name,
        role: data.role ?? "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return new User(result[0]);
  }

  protected async executeFindById(
    id: EntityId,
    options?: FindOptions
  ): Promise<User | null> {
    const result = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return new User(result[0]);
  }

  protected async executeFindMany(
    criteria: FilterCriteria,
    options?: FindOptions
  ): Promise<User[]> {
    // Build query based on criteria
    let query = this.db.select().from(usersTable);

    // Apply filters (simplified example)
    if (criteria.conditions) {
      // Apply filter conditions...
    }

    const results = await query;
    return results.map((row) => new User(row));
  }

  protected async executeUpdate(
    id: EntityId,
    data: UpdateUserData,
    options?: UpdateOptions
  ): Promise<User> {
    const result = await this.db
      .update(usersTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return new User(result[0]);
  }

  protected async executeDelete(
    id: EntityId,
    options?: DeleteOptions
  ): Promise<void> {
    if (this.config.softDelete) {
      await this.db
        .update(usersTable)
        .set({ deletedAt: new Date() })
        .where(eq(usersTable.id, id));
    } else {
      await this.db.delete(usersTable).where(eq(usersTable.id, id));
    }
  }

  protected async executeCount(criteria?: FilterCriteria): Promise<number> {
    let query = this.db.select({ count: count() }).from(usersTable);

    // Apply filters...

    const result = await query;
    return result[0].count;
  }

  protected async executeSearch(
    query: SearchQuery
  ): Promise<SearchResult<User>> {
    // Implement search logic
    const results = await this.db
      .select()
      .from(usersTable)
      .where(like(usersTable.name, `%${query.term}%`))
      .limit(query.limit || 10);

    return {
      items: results.map((row) => new User(row)),
      total: results.length,
      term: query.term,
    };
  }

  // Custom methods
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return result.length > 0 ? new User(result[0]) : null;
  }
}
```

### **Step 4: Create Service Layer**

```typescript
// src/services/user.service.ts
import {
  BaseService,
  type EntityId,
  ConflictError,
  ValidationError,
} from "@10xsai/ts-serverless";
import {
  User,
  type CreateUserData,
  type UpdateUserData,
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

  // Override validation methods
  protected async validateCreate(data: CreateUserData): Promise<void> {
    // Validate input data
    const validation = CreateUserSchema.safeParse(data);
    if (!validation.success) {
      throw new ValidationError("Invalid user data", validation.error.errors);
    }

    // Check for unique email
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
  }

  // Business methods
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async promoteUserToAdmin(id: EntityId): Promise<User> {
    const user = await this.getById(id);
    user.promoteToAdmin();
    return await this.update(id, { role: "admin" });
  }

  async getActiveUsers(): Promise<User[]> {
    return await this.userRepository.findMany({
      conditions: [{ field: "deletedAt", operator: "isNull" }],
    });
  }
}
```

### **Step 5: Create Cloudflare Worker**

```typescript
// src/index.ts
import {
  createApiResponse,
  handleError,
  type ApiResponse,
} from "@10xsai/ts-serverless";
import { UserService } from "./services/user.service";
import { UserRepository } from "./repositories/user.repository";
import { drizzle } from "drizzle-orm/d1";

interface Environment {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Environment): Promise<Response> {
    try {
      // Initialize dependencies
      const db = drizzle(env.DB);
      const userRepository = new UserRepository(db);
      const userService = new UserService(userRepository);

      // Parse URL
      const url = new URL(request.url);
      const path = url.pathname;
      const method = request.method;

      // Route handling
      if (path === "/users" && method === "POST") {
        return await createUser(request, userService);
      }

      if (path.startsWith("/users/") && method === "GET") {
        const id = path.split("/")[2];
        return await getUser(id, userService);
      }

      if (path.startsWith("/users/") && method === "PUT") {
        const id = path.split("/")[2];
        return await updateUser(id, request, userService);
      }

      if (path.startsWith("/users/") && method === "DELETE") {
        const id = path.split("/")[2];
        return await deleteUser(id, userService);
      }

      if (path === "/users" && method === "GET") {
        return await listUsers(request, userService);
      }

      return createApiResponse.notFound("Endpoint not found");
    } catch (error) {
      return handleError(error);
    }
  },
};

// Handler functions
async function createUser(
  request: Request,
  userService: UserService
): Promise<Response> {
  const data = await request.json();
  const user = await userService.create(data);
  return createApiResponse.created(user);
}

async function getUser(
  id: string,
  userService: UserService
): Promise<Response> {
  const user = await userService.getById(id);
  return createApiResponse.success(user);
}

async function updateUser(
  id: string,
  request: Request,
  userService: UserService
): Promise<Response> {
  const data = await request.json();
  const user = await userService.update(id, data);
  return createApiResponse.success(user);
}

async function deleteUser(
  id: string,
  userService: UserService
): Promise<Response> {
  await userService.delete(id);
  return createApiResponse.success({ message: "User deleted successfully" });
}

async function listUsers(
  request: Request,
  userService: UserService
): Promise<Response> {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  const result = await userService.list({ page, limit });
  return createApiResponse.paginated(result.data, result.pagination);
}
```

## 🔧 **Configuration**

### **Cloudflare Workers Setup**

Create `wrangler.toml`:

```toml
name = "my-user-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[ d1_databases ]]
binding = "DB"
database_name = "my-app-db"
database_id = "your-database-id"
```

### **Database Schema**

```typescript
// src/database/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  version: integer("version").notNull().default(1),
});
```

## 🚀 **Deployment**

Deploy to Cloudflare Workers:

```bash
# Deploy to staging
wrangler deploy --env staging

# Deploy to production
wrangler deploy --env production
```

## 🎯 **Next Steps**

Now that you have a basic application running, consider exploring:

1. **[Architecture Guide](./architecture.md)** - Understand the framework's design
2. **[Advanced Features](../README.md#advanced-features)** - Query system, validation, security
3. **[Best Practices](./guides/best-practices.md)** - Recommended patterns and practices
4. **[Examples](../examples/)** - More complex real-world examples

## 🐛 **Troubleshooting**

### Common Issues

**TypeScript Errors**

```bash
# Ensure you have correct TypeScript version
npm install -D typescript@^5.0.0
```

**Module Resolution Issues**

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "strict": true
  }
}
```

**Deployment Issues**

```bash
# Check wrangler configuration
wrangler whoami
wrangler d1 list
```

## 💬 **Support**

Need help? Check out:

- [FAQ](./faq.md)
- [GitHub Issues](https://github.com/10xsai/10xsai.com/issues)
- [Community Discussions](https://github.com/10xsai/10xsai.com/discussions)
