import type { FilterCriteria, SortCriteria } from '../types.js';
import type { QueryBuilder, Query } from './types.js';
/**
 * Basic query builder implementation
 */
export declare class BaseQueryBuilder<T> implements QueryBuilder<T> {
    private query;
    where(criteria: FilterCriteria): QueryBuilder<T>;
    orderBy(sort: SortCriteria[]): QueryBuilder<T>;
    limit(limit: number): QueryBuilder<T>;
    offset(offset: number): QueryBuilder<T>;
    select(fields: string[]): QueryBuilder<T>;
    include(relations: string[]): QueryBuilder<T>;
    build(): Query<T>;
}
/**
 * Create a new query builder
 */
export declare const createQueryBuilder: <T>() => QueryBuilder<T>;
