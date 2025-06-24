import type { BaseEntity, EntityId, CreateOptions, UpdateOptions, DeleteOptions, FindOptions, ListOptions, PaginatedResult, SearchQuery, SearchResult } from '../types.js';
import type { IService, IRepository, ServiceConfig } from './types.js';
/**
 * Abstract base service class for business logic
 */
export declare abstract class BaseService<TEntity extends BaseEntity, TCreateInput = Partial<TEntity>, TUpdateInput = Partial<TEntity>> implements IService<TEntity, TCreateInput, TUpdateInput> {
    protected readonly config: ServiceConfig;
    protected readonly repository: IRepository<TEntity, TCreateInput, TUpdateInput>;
    constructor(repository: IRepository<TEntity, TCreateInput, TUpdateInput>, config?: ServiceConfig);
    /**
     * Create a new entity
     */
    create(data: TCreateInput, options?: CreateOptions): Promise<TEntity>;
    /**
     * Find entity by ID
     */
    findById(id: EntityId, options?: FindOptions): Promise<TEntity | null>;
    /**
     * Update an entity
     */
    update(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<TEntity>;
    /**
     * Delete an entity
     */
    delete(id: EntityId, options?: DeleteOptions): Promise<void>;
    /**
     * List entities with pagination
     */
    list(options: ListOptions): Promise<PaginatedResult<TEntity>>;
    /**
     * Search entities
     */
    search(query: SearchQuery): Promise<SearchResult<TEntity>>;
    protected beforeCreate(data: TCreateInput, options?: CreateOptions): Promise<void>;
    protected afterCreate(entity: TEntity, options?: CreateOptions): Promise<void>;
    protected beforeUpdate(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<void>;
    protected afterUpdate(entity: TEntity, options?: UpdateOptions): Promise<void>;
    protected beforeDelete(id: EntityId, options?: DeleteOptions): Promise<void>;
    protected afterDelete(id: EntityId, options?: DeleteOptions): Promise<void>;
    protected afterFind(entity: TEntity, options?: FindOptions): Promise<void>;
    protected validateCreate(data: TCreateInput, options?: CreateOptions): Promise<void>;
    protected validateUpdate(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<void>;
    protected onError(operation: string, error: unknown, context: Record<string, unknown>): Promise<void>;
}
