/**
 * Basic query builder implementation
 */
export class BaseQueryBuilder {
    query = {};
    where(criteria) {
        this.query.criteria = criteria;
        return this;
    }
    orderBy(sort) {
        this.query.sort = sort;
        return this;
    }
    limit(limit) {
        if (!this.query.pagination) {
            this.query.pagination = {};
        }
        this.query.pagination.limit = limit;
        return this;
    }
    offset(offset) {
        if (!this.query.pagination) {
            this.query.pagination = {};
        }
        this.query.pagination.offset = offset;
        return this;
    }
    select(fields) {
        this.query.fields = fields;
        return this;
    }
    include(relations) {
        this.query.includes = relations;
        return this;
    }
    build() {
        return {
            ...this.query,
            toString: () => JSON.stringify(this.query),
        };
    }
}
/**
 * Create a new query builder
 */
export const createQueryBuilder = () => {
    return new BaseQueryBuilder();
};
