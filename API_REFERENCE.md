# @my-org/ts-serverless - Complete API Reference

## 📚 Base Classes

### Entity

Base class for all domain entities with built-in audit trail, soft delete, and metadata support.

```typescript
abstract class Entity {
  readonly id: EntityId;
  readonly createdAt: Date;
  updatedAt: Date;
  createdBy?: UserId;
  updatedBy?: UserId;
  version: number;
  deletedAt?: Date;
  metadata: Record<string, unknown>;

  constructor(id?: EntityId);

  // Methods
  touch(): void; // Update timestamps
  markDeleted(): void; // Soft delete
  restore(): void; // Restore from soft delete
  setMetadata(key: string, value: unknown): void;
  getMetadata<T>(key: string): T | undefined;
  isDeleted(): boolean;
  isNew(): boolean;
  equals(other: Entity): boolean;
  toJSON(): Record<string, unknown>;
}
```

### BaseRepository<T>

Generic repository with CRUD operations, filtering, and pagination.

```typescript
abstract class BaseRepository<T extends Entity> {
  protected readonly db: any;
  protected readonly table: any;
  protected readonly entityName: string;

  constructor(db: any, table: any);

  // Abstract methods to implement
  protected abstract mapToEntity(row: any): T;
  protected abstract mapToRow(entity: T): any;

  // CRUD operations
  async create(entity: T, options?: CreateOptions): Promise<T>;
  async update(entity: T, options?: UpdateOptions): Promise<T>;
  async delete(id: EntityId, options?: DeleteOptions): Promise<void>;
  async findById(id: EntityId, options?: FindOptions): Promise<T | null>;
  async findMany(options?: ListOptions): Promise<T[]>;
  async count(filter?: FilterCriteria): Promise<number>;
  async exists(id: EntityId): Promise<boolean>;

  // Utility methods
  protected buildSoftDeleteFilter(): any;
  protected buildFilterConditions(filter: FilterCriteria): any;
  protected buildSortConditions(sort: SortCriteria[]): any;
  protected applyPagination(query: any, options: PaginationOptions): any;
}
```

### BaseService

Base service class with validation and error handling utilities.

```typescript
abstract class BaseService {
  protected async validateInput<T>(
    schema: ValidationSchema<T>,
    data: unknown
  ): Promise<T>;

  protected createValidationError(
    message: string,
    details?: Record<string, unknown>
  ): ValidationError;

  protected createNotFoundError(
    message: string,
    details?: Record<string, unknown>
  ): NotFoundError;

  protected async withTransaction<T>(
    operation: (tx: any) => Promise<T>
  ): Promise<T>;
}
```

## 🗄️ Database

### ConnectionManager

Singleton connection manager for database connections.

```typescript
class ConnectionManager {
  static getInstance(): ConnectionManager;

  async getConnection(config: DatabaseConfig): Promise<DatabaseConnection>;
  async closeAll(): Promise<void>;
  getHealthStatus(): Promise<HealthStatus>;
}
```

### DatabaseAdapter

Adapter for different database types (D1, PostgreSQL, etc.).

```typescript
class DatabaseAdapter {
  constructor(database: any, config?: DatabaseConfig);

  async query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  async execute(sql: string, params?: unknown[]): Promise<void>;
  async transaction<T>(callback: (tx: any) => Promise<T>): Promise<T>;
  async migrate(): Promise<void>;
  async ping(): Promise<boolean>;
}
```

## ✅ Validation

### validators

Collection of common validation utilities.

```typescript
const validators = {
  string: () => ZodString;
  number: () => ZodNumber;
  boolean: () => ZodBoolean;
  email: () => ZodString;
  url: () => ZodString;
  uuid: () => ZodString;
  date: () => ZodDate;
  optional: <T>(schema: ZodType<T>) => ZodOptional<T>;
  array: <T>(schema: ZodType<T>) => ZodArray<T>;
  object: <T>(shape: Record<string, ZodType<any>>) => ZodObject<T>;
};
```

### validate

Main validation function.

```typescript
const validate = <T>(
  schema: ValidationSchema<T>,
  data: unknown
): ValidationResult<T>;
```

## ❌ Error Classes

### BaseError

Abstract base class for all framework errors.

```typescript
abstract class BaseError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;
  readonly timestamp: Date;
  readonly traceId?: TraceId;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    details?: Record<string, unknown>
  );

  toJSON(): ErrorResponse;
  toString(): string;
}
```

### Specific Error Types

```typescript
class ValidationError extends BaseError {
  constructor(message: string, details?: ValidationErrorDetails);
}

class NotFoundError extends BaseError {
  constructor(
    message: string,
    details?: { entityId?: string; entityType?: string }
  );
}

class ConflictError extends BaseError {
  constructor(message: string, details?: { conflictField?: string });
}

class UnauthorizedError extends BaseError {
  constructor(
    message: string,
    details?: { action?: string; resource?: string }
  );
}

class ForbiddenError extends BaseError {
  constructor(message: string, details?: { requiredRole?: string });
}

class InternalServerError extends BaseError {
  constructor(message?: string, details?: Record<string, unknown>);
}

class BadRequestError extends BaseError {
  constructor(message: string, details?: Record<string, unknown>);
}

class ServiceUnavailableError extends BaseError {
  constructor(message?: string, details?: { service?: string });
}
```

### Error Handlers

```typescript
// Handle errors in Cloudflare Workers context
function handleError(error: unknown): Response;

// Process validation errors
function processValidationError(error: ValidationError): ErrorResponse;

// Log errors with context
function logError(error: BaseError, context?: ErrorContext): void;
```

## 🔍 Query System

### BaseQueryBuilder

Fluent query builder interface.

```typescript
abstract class BaseQueryBuilder<T> {
  where(condition: FilterCondition): this;
  whereIn(field: string, values: unknown[]): this;
  whereNotNull(field: string): this;
  orderBy(field: string, direction?: "ASC" | "DESC"): this;
  limit(count: number): this;
  offset(count: number): this;

  abstract build(): T;
  abstract execute(): Promise<any[]>;
}
```

### FilterBuilder

Builder for complex filter conditions.

```typescript
class FilterBuilder {
  static create(): FilterBuilder;

  where(field: string, operator: FilterOperator, value?: unknown): this;
  whereIn(field: string, values: unknown[]): this;
  whereNotIn(field: string, values: unknown[]): this;
  whereNull(field: string): this;
  whereNotNull(field: string): this;
  whereBetween(field: string, min: unknown, max: unknown): this;
  wherelike(field: string, pattern: string): this;

  and(): this;
  or(): this;
  group(callback: (builder: FilterBuilder) => void): this;

  build(): FilterCriteria;
}
```

## 🛡️ Security

### Input Sanitization

```typescript
// Sanitize user input to prevent XSS
function sanitizeInput(input: string): string;

// Remove HTML tags
function stripHtml(input: string): string;

// Escape HTML entities
function escapeHtml(input: string): string;

// Sanitize for SQL (additional layer beyond prepared statements)
function sanitizeSql(input: string): string;

// Sanitize file names
function sanitizeFilename(filename: string): string;
```

### Security Validation

```typescript
// Validate password strength
function validatePasswordStrength(password: string): ValidationResult<string>;

// Check for safe file names
function validateSafeFilename(filename: string): boolean;

// Validate secure strings (no suspicious patterns)
function validateSecureString(input: string): boolean;

// Rate limiting helpers
function createRateLimiter(options: RateLimitOptions): RateLimiter;
```

## 🔧 Utilities

### Helper Functions

```typescript
// ID generation
function generateId(): string;
function generateShortId(): string;
function generateUuid(): string;

// Brand type creators
function createEntityId(value: string): EntityId;
function createUserId(value: string): UserId;
function createTenantId(value: string): TenantId;
function createTraceId(value: string): TraceId;

// Object utilities
function deepMerge<T>(target: T, source: Partial<T>): T;
function deepClone<T>(obj: T): T;
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;

// Array utilities
function chunk<T>(array: T[], size: number): T[][];
function unique<T>(array: T[]): T[];
function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]>;

// Date utilities
function formatDate(date: Date, format?: string): string;
function isValidDate(date: unknown): date is Date;
function addDays(date: Date, days: number): Date;
function diffInDays(date1: Date, date2: Date): number;

// Async utilities
function sleep(ms: number): Promise<void>;
function timeout<T>(promise: Promise<T>, ms: number): Promise<T>;
function retryOperation<T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T>;

// Pagination helpers
function calculatePagination(
  page: number,
  limit: number,
  total: number
): PaginationInfo;
function createCursor(data: any): string;
function parseCursor(cursor: string): any;
```

### Response Utilities

```typescript
// Create standard API responses
function createResponse<T>(
  data: T,
  status?: number,
  headers?: Record<string, string>
): Response;

function createSuccessResponse<T>(data: T, message?: string): Response;

function createErrorResponse(
  error: string | BaseError,
  status?: number
): Response;

function createPaginatedResponse<T>(
  data: T[],
  pagination: PaginationInfo
): Response;

// CORS helpers
function addCorsHeaders(response: Response, options?: CorsOptions): Response;
function createCorsResponse(options?: CorsOptions): Response;

// JSON utilities
function safeJsonParse<T>(json: string, fallback?: T): T | null;
function safeJsonStringify(obj: unknown): string | null;
```

## 🏷️ Type Definitions

### Brand Types

```typescript
type Brand<T, TBrand> = T & { __brand: TBrand };

type EntityId = Brand<string, "EntityId">;
type UserId = Brand<string, "UserId">;
type TenantId = Brand<string, "TenantId">;
type TraceId = Brand<string, "TraceId">;
```

### Utility Types

```typescript
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### Entity Types

```typescript
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

interface AuditTrail {
  operation: "CREATE" | "UPDATE" | "DELETE";
  entityId: EntityId;
  entityType: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
  timestamp: Date;
  userId?: UserId;
  traceId: TraceId;
  metadata?: Record<string, unknown>;
}
```

### Operation Options

```typescript
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

interface DeleteOptions {
  soft?: boolean;
  skipEvents?: boolean;
  auditTrail?: boolean;
  cascade?: boolean;
}

interface FindOptions {
  include?: string[];
  exclude?: string[];
  withDeleted?: boolean;
  forUpdate?: boolean;
}

interface ListOptions extends FindOptions, PaginationOptions {
  sort?: SortCriteria[];
  filter?: FilterCriteria;
  search?: SearchQuery;
}
```

### Query Types

```typescript
interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
  cursor?: string;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationInfo;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

interface SortCriteria {
  field: string;
  direction: "ASC" | "DESC";
  nulls?: "FIRST" | "LAST";
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

interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value?: unknown;
  values?: unknown[];
}

interface FilterCriteria {
  conditions?: FilterCondition[];
  logic?: "AND" | "OR";
  groups?: FilterCriteria[];
}

interface SearchQuery {
  query?: string;
  fields?: string[];
  fuzzy?: boolean;
  limit?: number;
  offset?: number;
}

interface SearchResult<T> {
  data: T[];
  total: number;
  highlights?: Record<string, string[]>;
}
```

### Response Types

```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
  traceId: TraceId;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  traceId: TraceId;
}

interface ErrorContext {
  traceId: TraceId;
  operation?: string;
  entityType?: string;
  entityId?: EntityId;
  userId?: UserId;
  tenantId?: TenantId;
  metadata?: Record<string, unknown>;
}
```

### Validation Types

```typescript
interface ValidationIssue {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

type ValidationSchema<T> = ZodType<T>;
type ValidationResult<T> = SafeParseReturnType<unknown, T>;

interface ValidationContext {
  path?: string[];
  field?: string;
  operation?: string;
  entityType?: string;
  metadata?: Record<string, unknown>;
}

interface ValidationOptions {
  skipUnknownFields?: boolean;
  abortEarly?: boolean;
  stripUnknown?: boolean;
  allowDirty?: boolean;
  context?: ValidationContext;
}
```

## 🔧 Configuration Types

```typescript
interface DatabaseConfig {
  type: "sqlite" | "postgresql" | "d1";
  connectionString?: string;
  database?: any; // D1 database binding
  pool?: {
    min: number;
    max: number;
    acquireTimeoutMillis?: number;
    idleTimeoutMillis?: number;
  };
  migrations?: {
    directory: string;
    tableName?: string;
  };
}

interface SecurityConfig {
  rateLimiting?: {
    enabled: boolean;
    windowMs: number;
    maxRequests: number;
  };
  inputSanitization?: {
    enabled: boolean;
    allowedTags?: string[];
    allowedAttributes?: string[];
  };
  cors?: CorsOptions;
}

interface CorsOptions {
  origin?: string | string[] | boolean;
  methods?: string[];
  allowedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}
```

This comprehensive API reference provides all the details needed to effectively use the `@my-org/ts-serverless` library.
