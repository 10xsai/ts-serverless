import type {
    BaseEntity,
    EntityId,
    CreateOptions,
    UpdateOptions,
    DeleteOptions,
    FindOptions,
    ListOptions,
    PaginatedResult,
    SearchQuery,
    SearchResult,
    FilterCriteria,
} from '../types.js';
import type { IRepository, RepositoryConfig } from './types.js';

import { generateTraceId } from '../utils/helpers.js';

/**
 * Abstract base repository class (lightweight for serverless)
 */
export abstract class BaseRepository<
    TEntity extends BaseEntity,
    TCreateInput = Partial<TEntity>,
    TUpdateInput = Partial<TEntity>
> implements IRepository<TEntity, TCreateInput, TUpdateInput> {

    protected readonly config: RepositoryConfig;

    constructor(config: RepositoryConfig = {}) {
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

    // Abstract methods to be implemented by concrete repositories
    protected abstract executeCreate(data: TCreateInput, options?: CreateOptions): Promise<TEntity>;
    protected abstract executeFindById(id: EntityId, options?: FindOptions): Promise<TEntity | null>;
    protected abstract executeFindMany(criteria: FilterCriteria, options?: FindOptions): Promise<TEntity[]>;
    protected abstract executeUpdate(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<TEntity>;
    protected abstract executeDelete(id: EntityId, options?: DeleteOptions): Promise<void>;
    protected abstract executeCount(criteria?: FilterCriteria): Promise<number>;
    protected abstract executeSearch(query: SearchQuery): Promise<SearchResult<TEntity>>;

    /**
     * Create a new entity
     */
    async create(data: TCreateInput, options?: CreateOptions): Promise<TEntity> {
        const traceId = generateTraceId();
        try {
            await this.beforeCreate(data, options);
            const entity = await this.executeCreate(data, options);
            await this.afterCreate(entity, options);
            return entity;
        } catch (error) {
            await this.onError('create', error, { data, options, traceId });
            throw error;
        }
    }

    /**
     * Find entity by ID
     */
    async findById(id: EntityId, options?: FindOptions): Promise<TEntity | null> {
        const traceId = generateTraceId();
        try {
            const entity = await this.executeFindById(id, options);
            if (entity && this.config.softDelete && !options?.withDeleted) {
                if (this.isDeleted(entity)) {
                    return null;
                }
            }
            return entity;
        } catch (error) {
            await this.onError('findById', error, { id, options, traceId });
            throw error;
        }
    }

    /**
     * Find multiple entities
     */
    async findMany(criteria: FilterCriteria, options?: FindOptions): Promise<TEntity[]> {
        const traceId = generateTraceId();
        try {
            const enhancedCriteria = this.applySoftDeleteFilter(criteria, options);
            return await this.executeFindMany(enhancedCriteria, options);
        } catch (error) {
            await this.onError('findMany', error, { criteria, options, traceId });
            throw error;
        }
    }

    /**
     * Update an entity
     */
    async update(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<TEntity> {
        const traceId = generateTraceId();
        try {
            await this.beforeUpdate(id, data, options);
            const entity = await this.executeUpdate(id, data, options);
            await this.afterUpdate(entity, options);
            return entity;
        } catch (error) {
            await this.onError('update', error, { id, data, options, traceId });
            throw error;
        }
    }

    /**
     * Delete an entity
     */
    async delete(id: EntityId, options?: DeleteOptions): Promise<void> {
        const traceId = generateTraceId();
        try {
            await this.beforeDelete(id, options);
            await this.executeDelete(id, options);
            await this.afterDelete(id, options);
        } catch (error) {
            await this.onError('delete', error, { id, options, traceId });
            throw error;
        }
    }

    /**
     * Count entities
     */
    async count(criteria?: FilterCriteria): Promise<number> {
        const traceId = generateTraceId();
        try {
            const enhancedCriteria = this.applySoftDeleteFilter(criteria);
            return await this.executeCount(enhancedCriteria);
        } catch (error) {
            await this.onError('count', error, { criteria, traceId });
            throw error;
        }
    }

    /**
     * Check if entity exists
     */
    async exists(id: EntityId): Promise<boolean> {
        const entity = await this.findById(id);
        return entity !== null;
    }

    /**
     * List entities with pagination
     */
    async list(options: ListOptions): Promise<PaginatedResult<TEntity>> {
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
    async search(query: SearchQuery): Promise<SearchResult<TEntity>> {
        const traceId = generateTraceId();
        try {
            return await this.executeSearch(query);
        } catch (error) {
            await this.onError('search', error, { query, traceId });
            throw error;
        }
    }

    // Protected helper methods
    protected applySoftDeleteFilter(criteria?: FilterCriteria, options?: FindOptions): FilterCriteria {
        if (!this.config.softDelete || options?.withDeleted) {
            return criteria || {};
        }

        const deleteFilter = {
            field: 'deletedAt',
            operator: 'isNull' as const,
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

    protected isDeleted(entity: TEntity): boolean {
        return Boolean(entity.deletedAt);
    }

    // Hook methods (can be overridden by subclasses)
    protected async beforeCreate(data: TCreateInput, options?: CreateOptions): Promise<void> {
        // Override in subclasses
    }

    protected async afterCreate(entity: TEntity, options?: CreateOptions): Promise<void> {
        // Override in subclasses
    }

    protected async beforeUpdate(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<void> {
        // Override in subclasses
    }

    protected async afterUpdate(entity: TEntity, options?: UpdateOptions): Promise<void> {
        // Override in subclasses
    }

    protected async beforeDelete(id: EntityId, options?: DeleteOptions): Promise<void> {
        // Override in subclasses
    }

    protected async afterDelete(id: EntityId, options?: DeleteOptions): Promise<void> {
        // Override in subclasses
    }

    protected async onError(operation: string, error: unknown, context: Record<string, unknown>): Promise<void> {
        // Override in subclasses for custom error handling
    }
} 