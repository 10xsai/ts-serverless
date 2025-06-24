import { z } from 'zod';
/**
 * Common validation schemas
 */
export declare const CommonSchemas: {
    id: z.ZodString;
    email: z.ZodString;
    url: z.ZodString;
    uuid: z.ZodString;
    timestamp: z.ZodDate;
    version: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
};
/**
 * Base entity schema
 */
export declare const BaseEntitySchema: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    createdBy: z.ZodOptional<z.ZodString>;
    updatedBy: z.ZodOptional<z.ZodString>;
    version: z.ZodNumber;
    deletedAt: z.ZodOptional<z.ZodDate>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    createdBy?: string | undefined;
    updatedBy?: string | undefined;
    deletedAt?: Date | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    version: number;
    createdBy?: string | undefined;
    updatedBy?: string | undefined;
    deletedAt?: Date | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
/**
 * Pagination schema
 */
export declare const PaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodOptional<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    offset?: number | undefined;
    cursor?: string | undefined;
}, {
    limit?: number | undefined;
    page?: number | undefined;
    offset?: number | undefined;
    cursor?: string | undefined;
}>;
/**
 * Sort criteria schema
 */
export declare const SortSchema: z.ZodObject<{
    field: z.ZodString;
    direction: z.ZodEnum<["ASC", "DESC"]>;
    nulls: z.ZodOptional<z.ZodEnum<["FIRST", "LAST"]>>;
}, "strip", z.ZodTypeAny, {
    field: string;
    direction: "ASC" | "DESC";
    nulls?: "FIRST" | "LAST" | undefined;
}, {
    field: string;
    direction: "ASC" | "DESC";
    nulls?: "FIRST" | "LAST" | undefined;
}>;
/**
 * Filter condition schema
 */
export declare const FilterConditionSchema: z.ZodObject<{
    field: z.ZodString;
    operator: z.ZodEnum<["eq", "ne", "gt", "gte", "lt", "lte", "like", "ilike", "startsWith", "endsWith", "contains", "in", "notIn", "isNull", "isNotNull", "between"]>;
    value: z.ZodOptional<z.ZodUnknown>;
    values: z.ZodOptional<z.ZodArray<z.ZodUnknown, "many">>;
}, "strip", z.ZodTypeAny, {
    field: string;
    operator: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "like" | "ilike" | "startsWith" | "endsWith" | "contains" | "in" | "notIn" | "isNull" | "isNotNull" | "between";
    values?: unknown[] | undefined;
    value?: unknown;
}, {
    field: string;
    operator: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "like" | "ilike" | "startsWith" | "endsWith" | "contains" | "in" | "notIn" | "isNull" | "isNotNull" | "between";
    values?: unknown[] | undefined;
    value?: unknown;
}>;
/**
 * Filter criteria schema
 */
export declare const FilterCriteriaSchema: z.ZodType<any>;
/**
 * Search query schema
 */
export declare const SearchQuerySchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    fields: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    fuzzy: z.ZodOptional<z.ZodBoolean>;
    limit: z.ZodOptional<z.ZodNumber>;
    offset: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    query?: string | undefined;
    limit?: number | undefined;
    fields?: string[] | undefined;
    offset?: number | undefined;
    fuzzy?: boolean | undefined;
}, {
    query?: string | undefined;
    limit?: number | undefined;
    fields?: string[] | undefined;
    offset?: number | undefined;
    fuzzy?: boolean | undefined;
}>;
