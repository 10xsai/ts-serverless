import { generateTraceId } from '../utils/helpers.js';
/**
 * Abstract base repository class (lightweight for serverless)
 */
export class BaseRepository {
    config;
    constructor(config = {}) {
        this.config = {
            softDelete: true,
            timestamps: true,
            auditTrail: false,
            tenantIsolation: false,
            optimisticLocking: true,
            caching: false,
            cacheTtl: 300,
            ...config,
        };
    }
    /**
     * Create a new entity
     */
    async create(data, options) {
        const traceId = generateTraceId();
        try {
            await this.beforeCreate(data, options);
            const entity = await this.executeCreate(data, options);
            await this.afterCreate(entity, options);
            return entity;
        }
        catch (error) {
            await this.onError('create', error, { data, options, traceId });
            throw error;
        }
    }
    /**
     * Find entity by ID
     */
    async findById(id, options) {
        const traceId = generateTraceId();
        try {
            const entity = await this.executeFindById(id, options);
            if (entity && this.config.softDelete && !options?.withDeleted) {
                if (this.isDeleted(entity)) {
                    return null;
                }
            }
            return entity;
        }
        catch (error) {
            await this.onError('findById', error, { id, options, traceId });
            throw error;
        }
    }
    /**
     * Find multiple entities
     */
    async findMany(criteria, options) {
        const traceId = generateTraceId();
        try {
            const enhancedCriteria = this.applySoftDeleteFilter(criteria, options);
            return await this.executeFindMany(enhancedCriteria, options);
        }
        catch (error) {
            await this.onError('findMany', error, { criteria, options, traceId });
            throw error;
        }
    }
    /**
     * Update an entity
     */
    async update(id, data, options) {
        const traceId = generateTraceId();
        try {
            await this.beforeUpdate(id, data, options);
            const entity = await this.executeUpdate(id, data, options);
            await this.afterUpdate(entity, options);
            return entity;
        }
        catch (error) {
            await this.onError('update', error, { id, data, options, traceId });
            throw error;
        }
    }
    /**
     * Delete an entity
     */
    async delete(id, options) {
        const traceId = generateTraceId();
        try {
            await this.beforeDelete(id, options);
            await this.executeDelete(id, options);
            await this.afterDelete(id, options);
        }
        catch (error) {
            await this.onError('delete', error, { id, options, traceId });
            throw error;
        }
    }
    /**
     * Count entities
     */
    async count(criteria) {
        const traceId = generateTraceId();
        try {
            const enhancedCriteria = this.applySoftDeleteFilter(criteria);
            return await this.executeCount(enhancedCriteria);
        }
        catch (error) {
            await this.onError('count', error, { criteria, traceId });
            throw error;
        }
    }
    /**
     * Check if entity exists
     */
    async exists(id) {
        const entity = await this.findById(id);
        return entity !== null;
    }
    /**
     * List entities with pagination
     */
    async list(options) {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const criteria = options.filter || {};
        const enhancedCriteria = this.applySoftDeleteFilter(criteria, options);
        const [entities, total] = await Promise.all([
            this.executeFindMany(enhancedCriteria, options),
            this.executeCount(enhancedCriteria)
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            data: entities,
            pagination: {
                page,
                limit,
                total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }
    /**
     * Search entities
     */
    async search(query) {
        const traceId = generateTraceId();
        try {
            return await this.executeSearch(query);
        }
        catch (error) {
            await this.onError('search', error, { query, traceId });
            throw error;
        }
    }
    // Protected helper methods
    applySoftDeleteFilter(criteria, options) {
        if (!this.config.softDelete || options?.withDeleted) {
            return criteria || {};
        }
        const deleteFilter = {
            field: 'deletedAt',
            operator: 'isNull',
        };
        if (!criteria) {
            return {
                conditions: [deleteFilter],
            };
        }
        return {
            ...criteria,
            conditions: [...(criteria.conditions || []), deleteFilter],
        };
    }
    isDeleted(entity) {
        return Boolean(entity.deletedAt);
    }
    // Hook methods (can be overridden by subclasses)
    async beforeCreate(data, options) {
        // Override in subclasses
    }
    async afterCreate(entity, options) {
        // Override in subclasses
    }
    async beforeUpdate(id, data, options) {
        // Override in subclasses
    }
    async afterUpdate(entity, options) {
        // Override in subclasses
    }
    async beforeDelete(id, options) {
        // Override in subclasses
    }
    async afterDelete(id, options) {
        // Override in subclasses
    }
    async onError(operation, error, context) {
        // Override in subclasses for custom error handling
    }
}
