import type { FilterCriteria, FilterCondition } from '../types.js';

/**
 * Filter builder utilities
 */
export class FilterBuilder {
    private conditions: FilterCondition[] = [];

    eq(field: string, value: unknown): FilterBuilder {
        this.conditions.push({ field, operator: 'eq', value });
        return this;
    }

    ne(field: string, value: unknown): FilterBuilder {
        this.conditions.push({ field, operator: 'ne', value });
        return this;
    }

    gt(field: string, value: unknown): FilterBuilder {
        this.conditions.push({ field, operator: 'gt', value });
        return this;
    }

    gte(field: string, value: unknown): FilterBuilder {
        this.conditions.push({ field, operator: 'gte', value });
        return this;
    }

    lt(field: string, value: unknown): FilterBuilder {
        this.conditions.push({ field, operator: 'lt', value });
        return this;
    }

    lte(field: string, value: unknown): FilterBuilder {
        this.conditions.push({ field, operator: 'lte', value });
        return this;
    }

    like(field: string, value: unknown): FilterBuilder {
        this.conditions.push({ field, operator: 'like', value });
        return this;
    }

    in(field: string, values: unknown[]): FilterBuilder {
        this.conditions.push({ field, operator: 'in', values });
        return this;
    }

    isNull(field: string): FilterBuilder {
        this.conditions.push({ field, operator: 'isNull' });
        return this;
    }

    isNotNull(field: string): FilterBuilder {
        this.conditions.push({ field, operator: 'isNotNull' });
        return this;
    }

    build(): FilterCriteria {
        return {
            conditions: this.conditions,
            logic: 'AND',
        };
    }
}

/**
 * Create a new filter builder
 */
export const createFilter = (): FilterBuilder => {
    return new FilterBuilder();
};

/**
 * Combine multiple filter criteria with AND logic
 */
export const andFilters = (...filters: FilterCriteria[]): FilterCriteria => {
    return {
        groups: filters,
        logic: 'AND',
    };
};

/**
 * Combine multiple filter criteria with OR logic
 */
export const orFilters = (...filters: FilterCriteria[]): FilterCriteria => {
    return {
        groups: filters,
        logic: 'OR',
    };
}; 