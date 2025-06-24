import type { FilterCriteria, SortCriteria, PaginationOptions } from '../types.js';

/**
 * Query builder interface
 */
export interface QueryBuilder<T> {
    where(criteria: FilterCriteria): QueryBuilder<T>;
    orderBy(sort: SortCriteria[]): QueryBuilder<T>;
    limit(limit: number): QueryBuilder<T>;
    offset(offset: number): QueryBuilder<T>;
    select(fields: string[]): QueryBuilder<T>;
    include(relations: string[]): QueryBuilder<T>;
    build(): Query<T>;
}

/**
 * Query object
 */
export interface Query<T> {
    criteria?: FilterCriteria;
    sort?: SortCriteria[];
    pagination?: PaginationOptions;
    fields?: string[];
    includes?: string[];
    toString(): string;
}

/**
 * Query executor interface
 */
export interface QueryExecutor<T> {
    execute(query: Query<T>): Promise<T[]>;
    count(query: Query<T>): Promise<number>;
    first(query: Query<T>): Promise<T | null>;
}

/**
 * Query optimization hints
 */
export interface QueryHints {
    useIndex?: string;
    forceIndex?: boolean;
    noCache?: boolean;
    readOnly?: boolean;
}

/**
 * Query performance metrics
 */
export interface QueryMetrics {
    executionTime: number;
    rowsScanned: number;
    rowsReturned: number;
    indexesUsed: string[];
    cacheHit: boolean;
} 