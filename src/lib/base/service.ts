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
} from '../types.js';
import type { IService, IRepository, ServiceConfig } from './types.js';
import { generateTraceId } from '../utils/helpers.js';

/**
 * Abstract base service class for business logic
 */
export abstract class BaseService<
    TEntity extends BaseEntity,
    TCreateInput = Partial<TEntity>,
    TUpdateInput = Partial<TEntity>
> implements IService<TEntity, TCreateInput, TUpdateInput> {

    protected readonly config: ServiceConfig;
    protected readonly repository: IRepository<TEntity, TCreateInput, TUpdateInput>;

    constructor(
        repository: IRepository<TEntity, TCreateInput, TUpdateInput>,
        config: ServiceConfig = {}
    ) {
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
    async create(data: TCreateInput, options?: CreateOptions): Promise<TEntity> {
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
            const entity = await this.repository.findById(id, options);

            if (entity) {
                await this.afterFind(entity, options);
            }

            return entity;
        } catch (error) {
            await this.onError('findById', error, { id, options, traceId });
            throw error;
        }
    }

    /**
     * Update an entity
     */
    async update(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<TEntity> {
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
            // Pre-processing
            await this.beforeDelete(id, options);

            // Delete entity
            await this.repository.delete(id, options);

            // Post-processing
            await this.afterDelete(id, options);
        } catch (error) {
            await this.onError('delete', error, { id, options, traceId });
            throw error;
        }
    }

    /**
     * List entities with pagination
     */
    async list(options: ListOptions): Promise<PaginatedResult<TEntity>> {
        const traceId = generateTraceId();

        try {
            const result = await this.repository.list(options);

            // Post-process each entity
            for (const entity of result.data) {
                await this.afterFind(entity, options);
            }

            return result;
        } catch (error) {
            await this.onError('list', error, { options, traceId });
            throw error;
        }
    }

    /**
     * Search entities
     */
    async search(query: SearchQuery): Promise<SearchResult<TEntity>> {
        const traceId = generateTraceId();

        try {
            const result = await this.repository.search(query);

            // Post-process each entity
            for (const entity of result.data) {
                await this.afterFind(entity);
            }

            return result;
        } catch (error) {
            await this.onError('search', error, { query, traceId });
            throw error;
        }
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

    protected async afterFind(entity: TEntity, options?: FindOptions): Promise<void> {
        // Override in subclasses
    }

    protected async validateCreate(data: TCreateInput, options?: CreateOptions): Promise<void> {
        // Override in subclasses for custom validation
    }

    protected async validateUpdate(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<void> {
        // Override in subclasses for custom validation
    }

    protected async onError(operation: string, error: unknown, context: Record<string, unknown>): Promise<void> {
        // Override in subclasses for custom error handling
    }
} 