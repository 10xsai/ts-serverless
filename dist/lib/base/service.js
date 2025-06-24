import { generateTraceId } from '../utils/helpers.js';
/**
 * Abstract base service class for business logic
 */
export class BaseService {
    config;
    repository;
    constructor(repository, config = {}) {
        this.repository = repository;
        this.config = {
            validation: true,
            events: false,
            auditTrail: false,
            caching: false,
            retries: 0,
            ...config,
        };
    }
    /**
     * Create a new entity
     */
    async create(data, options) {
        const traceId = generateTraceId();
        try {
            // Pre-processing
            await this.beforeCreate(data, options);
            // Validation
            if (this.config.validation) {
                await this.validateCreate(data, options);
            }
            // Create entity
            const entity = await this.repository.create(data, options);
            // Post-processing
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
            const entity = await this.repository.findById(id, options);
            if (entity) {
                await this.afterFind(entity, options);
            }
            return entity;
        }
        catch (error) {
            await this.onError('findById', error, { id, options, traceId });
            throw error;
        }
    }
    /**
     * Update an entity
     */
    async update(id, data, options) {
        const traceId = generateTraceId();
        try {
            // Pre-processing
            await this.beforeUpdate(id, data, options);
            // Validation
            if (this.config.validation) {
                await this.validateUpdate(id, data, options);
            }
            // Update entity
            const entity = await this.repository.update(id, data, options);
            // Post-processing
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
            // Pre-processing
            await this.beforeDelete(id, options);
            // Delete entity
            await this.repository.delete(id, options);
            // Post-processing
            await this.afterDelete(id, options);
        }
        catch (error) {
            await this.onError('delete', error, { id, options, traceId });
            throw error;
        }
    }
    /**
     * List entities with pagination
     */
    async list(options) {
        const traceId = generateTraceId();
        try {
            const result = await this.repository.list(options);
            // Post-process each entity
            for (const entity of result.data) {
                await this.afterFind(entity, options);
            }
            return result;
        }
        catch (error) {
            await this.onError('list', error, { options, traceId });
            throw error;
        }
    }
    /**
     * Search entities
     */
    async search(query) {
        const traceId = generateTraceId();
        try {
            const result = await this.repository.search(query);
            // Post-process each entity
            for (const entity of result.data) {
                await this.afterFind(entity);
            }
            return result;
        }
        catch (error) {
            await this.onError('search', error, { query, traceId });
            throw error;
        }
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
    async afterFind(entity, options) {
        // Override in subclasses
    }
    async validateCreate(data, options) {
        // Override in subclasses for custom validation
    }
    async validateUpdate(id, data, options) {
        // Override in subclasses for custom validation
    }
    async onError(operation, error, context) {
        // Override in subclasses for custom error handling
    }
}
