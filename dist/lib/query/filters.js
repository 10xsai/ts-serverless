/**
 * Filter builder utilities
 */
export class FilterBuilder {
    conditions = [];
    eq(field, value) {
        this.conditions.push({ field, operator: 'eq', value });
        return this;
    }
    ne(field, value) {
        this.conditions.push({ field, operator: 'ne', value });
        return this;
    }
    gt(field, value) {
        this.conditions.push({ field, operator: 'gt', value });
        return this;
    }
    gte(field, value) {
        this.conditions.push({ field, operator: 'gte', value });
        return this;
    }
    lt(field, value) {
        this.conditions.push({ field, operator: 'lt', value });
        return this;
    }
    lte(field, value) {
        this.conditions.push({ field, operator: 'lte', value });
        return this;
    }
    like(field, value) {
        this.conditions.push({ field, operator: 'like', value });
        return this;
    }
    in(field, values) {
        this.conditions.push({ field, operator: 'in', values });
        return this;
    }
    isNull(field) {
        this.conditions.push({ field, operator: 'isNull' });
        return this;
    }
    isNotNull(field) {
        this.conditions.push({ field, operator: 'isNotNull' });
        return this;
    }
    build() {
        return {
            conditions: this.conditions,
            logic: 'AND',
        };
    }
}
/**
 * Create a new filter builder
 */
export const createFilter = () => {
    return new FilterBuilder();
};
/**
 * Combine multiple filter criteria with AND logic
 */
export const andFilters = (...filters) => {
    return {
        groups: filters,
        logic: 'AND',
    };
};
/**
 * Combine multiple filter criteria with OR logic
 */
export const orFilters = (...filters) => {
    return {
        groups: filters,
        logic: 'OR',
    };
};
