import { z } from 'zod';
/**
 * Common validation schemas
 */
export const CommonSchemas = {
    id: z.string().min(1),
    email: z.string().email(),
    url: z.string().url(),
    uuid: z.string().uuid(),
    timestamp: z.date(),
    version: z.number().int().min(1),
    metadata: z.record(z.unknown()).optional(),
};
/**
 * Base entity schema
 */
export const BaseEntitySchema = z.object({
    id: CommonSchemas.id,
    createdAt: CommonSchemas.timestamp,
    updatedAt: CommonSchemas.timestamp,
    createdBy: CommonSchemas.id.optional(),
    updatedBy: CommonSchemas.id.optional(),
    version: CommonSchemas.version,
    deletedAt: CommonSchemas.timestamp.optional(),
    metadata: CommonSchemas.metadata,
});
/**
 * Pagination schema
 */
export const PaginationSchema = z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(10),
    offset: z.number().int().min(0).optional(),
    cursor: z.string().optional(),
});
/**
 * Sort criteria schema
 */
export const SortSchema = z.object({
    field: z.string(),
    direction: z.enum(['ASC', 'DESC']),
    nulls: z.enum(['FIRST', 'LAST']).optional(),
});
/**
 * Filter condition schema
 */
export const FilterConditionSchema = z.object({
    field: z.string(),
    operator: z.enum([
        'eq', 'ne', 'gt', 'gte', 'lt', 'lte',
        'like', 'ilike', 'startsWith', 'endsWith', 'contains',
        'in', 'notIn', 'isNull', 'isNotNull', 'between'
    ]),
    value: z.unknown().optional(),
    values: z.array(z.unknown()).optional(),
});
/**
 * Filter criteria schema
 */
export const FilterCriteriaSchema = z.object({
    conditions: z.array(FilterConditionSchema).optional(),
    logic: z.enum(['AND', 'OR']).optional(),
    groups: z.array(z.lazy(() => FilterCriteriaSchema)).optional(),
});
/**
 * Search query schema
 */
export const SearchQuerySchema = z.object({
    query: z.string().optional(),
    fields: z.array(z.string()).optional(),
    fuzzy: z.boolean().optional(),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).optional(),
});
