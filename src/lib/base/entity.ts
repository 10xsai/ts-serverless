import { nanoid } from 'nanoid';
import type {
    BaseEntity,
    EntityId,
    UserId,
    TraceId,
    AuditTrail,
} from '../types.js';
import { createEntityId, createTraceId } from '../types.js';

/**
 * Abstract base entity class that provides common functionality
 * for all domain entities in the system
 */
export abstract class Entity implements BaseEntity {
    public readonly id: EntityId;
    public readonly createdAt: Date;
    public updatedAt: Date;
    public readonly createdBy?: UserId;
    public updatedBy?: UserId;
    public version: number;
    public deletedAt?: Date;
    public metadata?: Record<string, unknown>;

    constructor(data: Partial<BaseEntity> = {}) {
        this.id = data.id || createEntityId(nanoid());
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.createdBy = data.createdBy;
        this.updatedBy = data.updatedBy;
        this.version = data.version || 1;
        this.deletedAt = data.deletedAt;
        this.metadata = data.metadata || {};
    }

    /**
     * Check if entity is soft deleted
     */
    public isDeleted(): boolean {
        return this.deletedAt !== undefined && this.deletedAt !== null;
    }

    /**
     * Soft delete the entity
     */
    public softDelete(userId?: UserId): void {
        this.deletedAt = new Date();
        this.updatedBy = userId;
        this.markAsUpdated();
    }

    /**
     * Restore soft deleted entity
     */
    public restore(userId?: UserId): void {
        this.deletedAt = undefined;
        this.updatedBy = userId;
        this.markAsUpdated();
    }

    /**
     * Mark entity as updated
     */
    public markAsUpdated(userId?: UserId): void {
        this.updatedAt = new Date();
        if (userId) {
            this.updatedBy = userId;
        }
        this.version++;
    }

    /**
     * Add metadata to entity
     */
    public addMetadata(key: string, value: unknown): void {
        if (!this.metadata) {
            this.metadata = {};
        }
        this.metadata[key] = value;
        this.markAsUpdated();
    }

    /**
     * Get metadata value
     */
    public getMetadata<T = unknown>(key: string): T | undefined {
        return this.metadata?.[key] as T;
    }

    /**
     * Remove metadata key
     */
    public removeMetadata(key: string): void {
        if (this.metadata) {
            delete this.metadata[key];
            this.markAsUpdated();
        }
    }

    /**
     * Create audit trail entry for this entity
     */
    public createAuditTrail(
        operation: 'CREATE' | 'UPDATE' | 'DELETE',
        changes?: Record<string, { from: unknown; to: unknown }>,
        userId?: UserId,
        traceId?: TraceId
    ): AuditTrail {
        const auditTrail: AuditTrail = {
            operation,
            entityId: this.id,
            entityType: this.constructor.name,
            timestamp: new Date(),
            traceId: traceId || createTraceId(nanoid()),
        };

        if (changes) {
            auditTrail.changes = changes;
        }
        if (userId) {
            auditTrail.userId = userId;
        }
        if (this.metadata) {
            auditTrail.metadata = { ...this.metadata };
        }

        return auditTrail;
    }

    /**
     * Convert entity to plain object
     */
    public toPlainObject(): Record<string, unknown> {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            createdBy: this.createdBy,
            updatedBy: this.updatedBy,
            version: this.version,
            deletedAt: this.deletedAt,
            metadata: this.metadata,
        };
    }

    /**
     * Create a clone of the entity
     */
    public clone(): this {
        const Constructor = this.constructor as new (data: Partial<BaseEntity>) => this;
        return new Constructor(this.toPlainObject());
    }

    /**
     * Check if entity equals another entity
     */
    public equals(other: Entity): boolean {
        return this.id === other.id && this.version === other.version;
    }

    /**
     * Check if entity is newer than another entity
     */
    public isNewerThan(other: Entity): boolean {
        return this.updatedAt > other.updatedAt;
    }

    /**
     * Validate entity state (must be implemented by subclasses)
     */
    public abstract validate(): void;

    /**
     * Get entity type name
     */
    public getEntityType(): string {
        return this.constructor.name;
    }
} 