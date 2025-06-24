import type { BaseEntity, EntityId, CreateOptions, UpdateOptions, DeleteOptions, FindOptions, ListOptions, PaginatedResult, SearchQuery, SearchResult, FilterCriteria } from '../types.js';
import type { IRepository, RepositoryConfig } from './types.js';
/**
 * Abstract base repository class (lightweight for serverless)
 */
export declare abstract class BaseRepository<TEntity extends BaseEntity, TCreateInput = Partial<TEntity>, TUpdateInput = Partial<TEntity>> implements IRepository<TEntity, TCreateInput, TUpdateInput> {
    protected readonly config: RepositoryConfig;
    constructor(config?: RepositoryConfig);
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
    create(data: TCreateInput, options?: CreateOptions): Promise<TEntity>;
    /**
     * Find entity by ID
     */
    findById(id: EntityId, options?: FindOptions): Promise<TEntity | null>;
    /**
     * Find multiple entities
     */
    findMany(criteria: FilterCriteria, options?: FindOptions): Promise<TEntity[]>;
    /**
     * Update an entity
     */
    update(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<TEntity>;
    /**
     * Delete an entity
     */
    delete(id: EntityId, options?: DeleteOptions): Promise<void>;
    /**
     * Count entities
     */
    count(criteria?: FilterCriteria): Promise<number>;
    /**
     * Check if entity exists
     */
    exists(id: EntityId): Promise<boolean>;
    /**
     * List entities with pagination
     */
    list(options: ListOptions): Promise<PaginatedResult<TEntity>>;
    /**
     * Search entities
     */
    search(query: SearchQuery): Promise<SearchResult<TEntity>>;
    protected applySoftDeleteFilter(criteria?: FilterCriteria, options?: FindOptions): FilterCriteria;
    protected isDeleted(entity: TEntity): boolean;
    protected beforeCreate(data: TCreateInput, options?: CreateOptions): Promise<void>;
    protected afterCreate(entity: TEntity, options?: CreateOptions): Promise<void>;
    protected beforeUpdate(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<void>;
    protected afterUpdate(entity: TEntity, options?: UpdateOptions): Promise<void>;
    protected beforeDelete(id: EntityId, options?: DeleteOptions): Promise<void>;
    protected afterDelete(id: EntityId, options?: DeleteOptions): Promise<void>;
    protected onError(operation: string, error: unknown, context: Record<string, unknown>): Promise<void>;
}
