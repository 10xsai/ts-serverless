import type { FilterCriteria, SortCriteria } from '../types.js';
import type { QueryBuilder, Query } from './types.js';

/**
 * Basic query builder implementation
 */
export class BaseQueryBuilder<T> implements QueryBuilder<T> {
    private query: Partial<Query<T>> = {};

    where(criteria: FilterCriteria): QueryBuilder<T> {
        this.query.criteria = criteria;
        return this;
    }

    orderBy(sort: SortCriteria[]): QueryBuilder<T> {
        this.query.sort = sort;
        return this;
    }

    limit(limit: number): QueryBuilder<T> {
        if (!this.query.pagination) {
            this.query.pagination = {};
        }
        this.query.pagination.limit = limit;
        return this;
    }

    offset(offset: number): QueryBuilder<T> {
        if (!this.query.pagination) {
            this.query.pagination = {};
        }
        this.query.pagination.offset = offset;
        return this;
    }

    select(fields: string[]): QueryBuilder<T> {
        this.query.fields = fields;
        return this;
    }

    include(relations: string[]): QueryBuilder<T> {
        this.query.includes = relations;
        return this;
    }

    build(): Query<T> {
        return {
            ...this.query,
            toString: () => JSON.stringify(this.query),
        } as Query<T>;
    }
}

/**
 * Create a new query builder
 */
export const createQueryBuilder = <T>(): QueryBuilder<T> => {
    return new BaseQueryBuilder<T>();
}; 