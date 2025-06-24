import type { FilterCriteria } from '../types.js';
/**
 * Filter builder utilities
 */
export declare class FilterBuilder {
    private conditions;
    eq(field: string, value: unknown): FilterBuilder;
    ne(field: string, value: unknown): FilterBuilder;
    gt(field: string, value: unknown): FilterBuilder;
    gte(field: string, value: unknown): FilterBuilder;
    lt(field: string, value: unknown): FilterBuilder;
    lte(field: string, value: unknown): FilterBuilder;
    like(field: string, value: unknown): FilterBuilder;
    in(field: string, values: unknown[]): FilterBuilder;
    isNull(field: string): FilterBuilder;
    isNotNull(field: string): FilterBuilder;
    build(): FilterCriteria;
}
/**
 * Create a new filter builder
 */
export declare const createFilter: () => FilterBuilder;
/**
 * Combine multiple filter criteria with AND logic
 */
export declare const andFilters: (...filters: FilterCriteria[]) => FilterCriteria;
/**
 * Combine multiple filter criteria with OR logic
 */
export declare const orFilters: (...filters: FilterCriteria[]) => FilterCriteria;
