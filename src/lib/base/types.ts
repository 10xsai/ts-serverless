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

/**
 * Repository interface for CRUD operations
 */
export interface IRepository<
    TEntity extends BaseEntity,
    TCreateInput = Partial<TEntity>,
    TUpdateInput = Partial<TEntity>
> {
    create(data: TCreateInput, options?: CreateOptions): Promise<TEntity>;
    findById(id: EntityId, options?: FindOptions): Promise<TEntity | null>;
    findMany(criteria: FilterCriteria, options?: FindOptions): Promise<TEntity[]>;
    update(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<TEntity>;
    delete(id: EntityId, options?: DeleteOptions): Promise<void>;
    count(criteria?: FilterCriteria): Promise<number>;
    exists(id: EntityId): Promise<boolean>;
    list(options: ListOptions): Promise<PaginatedResult<TEntity>>;
    search(query: SearchQuery): Promise<SearchResult<TEntity>>;
}

/**
 * Repository configuration
 */
export interface RepositoryConfig {
    softDelete?: boolean;
    timestamps?: boolean;
    auditTrail?: boolean;
    tenantIsolation?: boolean;
    optimisticLocking?: boolean;
    caching?: boolean;
    cacheTtl?: number;
}

/**
 * Service interface for business logic
 */
export interface IService<
    TEntity extends BaseEntity,
    TCreateInput = Partial<TEntity>,
    TUpdateInput = Partial<TEntity>
> {
    create(data: TCreateInput, options?: CreateOptions): Promise<TEntity>;
    findById(id: EntityId, options?: FindOptions): Promise<TEntity | null>;
    update(id: EntityId, data: TUpdateInput, options?: UpdateOptions): Promise<TEntity>;
    delete(id: EntityId, options?: DeleteOptions): Promise<void>;
    list(options: ListOptions): Promise<PaginatedResult<TEntity>>;
    search(query: SearchQuery): Promise<SearchResult<TEntity>>;
}

/**
 * Service configuration
 */
export interface ServiceConfig {
    validation?: boolean;
    events?: boolean;
    auditTrail?: boolean;
    caching?: boolean;
    retries?: number;
}

/**
 * Domain service interface
 */
export interface IDomainService {
    readonly name: string;
    initialize?(): Promise<void>;
    cleanup?(): Promise<void>;
}

/**
 * Entity factory interface
 */
export interface IEntityFactory<TEntity extends BaseEntity> {
    create(data: Partial<TEntity>): TEntity;
    createFromPlainObject(data: Record<string, unknown>): TEntity;
    getEntityType(): string;
}

/**
 * Value object interface
 */
export interface IValueObject<T> {
    equals(other: T): boolean;
    toString(): string;
    toPlainObject(): Record<string, unknown>;
}

/**
 * Aggregate root interface
 */
export interface IAggregateRoot<TEntity extends BaseEntity> extends IValueObject<TEntity> {
    getId(): EntityId;
    getVersion(): number;
    markAsUpdated(): void;
    getUncommittedEvents(): unknown[];
    markEventsAsCommitted(): void;
}

/**
 * Repository factory interface
 */
export interface IRepositoryFactory {
    create<TEntity extends BaseEntity>(
        entityType: string,
        config?: RepositoryConfig
    ): IRepository<TEntity>;
}

/**
 * Query specification interface
 */
export interface ISpecification<TEntity extends BaseEntity> {
    isSatisfiedBy(entity: TEntity): boolean;
    toCriteria(): FilterCriteria;
}

/**
 * Unit of work interface
 */
export interface IUnitOfWork {
    begin(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    isActive(): boolean;
    registerNew<TEntity extends BaseEntity>(entity: TEntity): void;
    registerUpdated<TEntity extends BaseEntity>(entity: TEntity): void;
    registerDeleted<TEntity extends BaseEntity>(entity: TEntity): void;
} 