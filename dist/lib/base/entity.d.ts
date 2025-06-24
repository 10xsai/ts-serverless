import type { BaseEntity, EntityId, UserId, TraceId, AuditTrail } from '../types.js';
/**
 * Abstract base entity class that provides common functionality
 * for all domain entities in the system
 */
export declare abstract class Entity implements BaseEntity {
    readonly id: EntityId;
    readonly createdAt: Date;
    updatedAt: Date;
    readonly createdBy?: UserId;
    updatedBy?: UserId;
    version: number;
    deletedAt?: Date;
    metadata?: Record<string, unknown>;
    constructor(data?: Partial<BaseEntity>);
    /**
     * Check if entity is soft deleted
     */
    isDeleted(): boolean;
    /**
     * Soft delete the entity
     */
    softDelete(userId?: UserId): void;
    /**
     * Restore soft deleted entity
     */
    restore(userId?: UserId): void;
    /**
     * Mark entity as updated
     */
    markAsUpdated(userId?: UserId): void;
    /**
     * Add metadata to entity
     */
    addMetadata(key: string, value: unknown): void;
    /**
     * Get metadata value
     */
    getMetadata<T = unknown>(key: string): T | undefined;
    /**
     * Remove metadata key
     */
    removeMetadata(key: string): void;
    /**
     * Create audit trail entry for this entity
     */
    createAuditTrail(operation: 'CREATE' | 'UPDATE' | 'DELETE', changes?: Record<string, {
        from: unknown;
        to: unknown;
    }>, userId?: UserId, traceId?: TraceId): AuditTrail;
    /**
     * Convert entity to plain object
     */
    toPlainObject(): Record<string, unknown>;
    /**
     * Create a clone of the entity
     */
    clone(): this;
    /**
     * Check if entity equals another entity
     */
    equals(other: Entity): boolean;
    /**
     * Check if entity is newer than another entity
     */
    isNewerThan(other: Entity): boolean;
    /**
     * Validate entity state (must be implemented by subclasses)
     */
    abstract validate(): void;
    /**
     * Get entity type name
     */
    getEntityType(): string;
}
