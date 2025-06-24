import { z } from 'zod';

/**
 * Brand types for type safety
 */
export type Brand<T, TBrand> = T & { __brand: TBrand };

/**
 * ID types with brand safety
 */
export type EntityId = Brand<string, 'EntityId'>;
export type UserId = Brand<string, 'UserId'>;
export type TenantId = Brand<string, 'TenantId'>;
export type TraceId = Brand<string, 'TraceId'>;

/**
 * Utility types
 */
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Base entity interface with strict optional properties
 */
export interface BaseEntity {
    id: EntityId;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: UserId;
    updatedBy?: UserId;
    version: number;
    deletedAt?: Date;
    metadata?: Record<string, unknown>;
}

/**
 * Audit trail interface
 */
export interface AuditTrail {
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    entityId: EntityId;
    entityType: string;
    changes?: Record<string, { from: unknown; to: unknown }>;
    timestamp: Date;
    userId?: UserId;
    traceId: TraceId;
    metadata?: Record<string, unknown>;
}

/**
 * Pagination types
 */
export interface PaginationOptions {
    page?: number;
    limit?: number;
    offset?: number;
    cursor?: string;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasNext: boolean;
        hasPrev: boolean;
        nextCursor?: string;
        prevCursor?: string;
    };
}

/**
 * Search types
 */
export interface SearchQuery {
    query?: string;
    fields?: string[];
    fuzzy?: boolean;
    limit?: number;
    offset?: number;
}

export interface SearchResult<T> {
    data: T[];
    total: number;
    highlights?: Record<string, string[]>;
}

/**
 * Operation options with strict optional properties
 */
export interface CreateOptions {
    skipValidation?: boolean;
    skipEvents?: boolean;
    auditTrail?: boolean;
    metadata?: Record<string, unknown>;
}

export interface UpdateOptions extends CreateOptions {
    optimisticLocking?: boolean;
    partial?: boolean;
}

export interface DeleteOptions {
    soft?: boolean;
    skipEvents?: boolean;
    auditTrail?: boolean;
    cascade?: boolean;
}

export interface FindOptions {
    include?: string[];
    exclude?: string[];
    withDeleted?: boolean;
    forUpdate?: boolean;
}

export interface ListOptions extends FindOptions, PaginationOptions {
    sort?: SortCriteria[];
    filter?: FilterCriteria;
    search?: SearchQuery;
}

/**
 * Sorting types
 */
export interface SortCriteria {
    field: string;
    direction: 'ASC' | 'DESC';
    nulls?: 'FIRST' | 'LAST';
}

/**
 * Filtering types
 */
export type FilterOperator =
    | 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'
    | 'like' | 'ilike' | 'startsWith' | 'endsWith' | 'contains'
    | 'in' | 'notIn' | 'isNull' | 'isNotNull'
    | 'between';

export interface FilterCondition {
    field: string;
    operator: FilterOperator;
    value?: unknown;
    values?: unknown[];
}

export interface FilterCriteria {
    conditions?: FilterCondition[];
    logic?: 'AND' | 'OR';
    groups?: FilterCriteria[];
}

/**
 * Error context
 */
export interface ErrorContext {
    traceId: TraceId;
    operation?: string;
    entityType?: string;
    entityId?: EntityId;
    userId?: UserId;
    tenantId?: TenantId;
    metadata?: Record<string, unknown>;
}

export interface ValidationIssue {
    field: string;
    message: string;
    code: string;
    value?: unknown;
}

/**
 * Validation schema types
 */
export type ValidationSchema<T> = z.ZodType<T>;
export type ValidationResult<T> = z.SafeParseReturnType<unknown, T>;

/**
 * Response types
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: Date;
    traceId: TraceId;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    field?: string;
    traceId: TraceId;
}

export interface HealthCheck {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: Date;
    services?: Record<string, 'healthy' | 'unhealthy'>;
    version?: string;
}

/**
 * ID creation utilities
 */
export const createEntityId = (value: string): EntityId => value as EntityId;
export const createUserId = (value: string): UserId => value as UserId;
export const createTenantId = (value: string): TenantId => value as TenantId;
export const createTraceId = (value: string): TraceId => value as TraceId; 