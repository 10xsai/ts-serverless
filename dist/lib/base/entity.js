import { nanoid } from 'nanoid';
import { createEntityId, createTraceId } from '../types.js';
/**
 * Abstract base entity class that provides common functionality
 * for all domain entities in the system
 */
export class Entity {
    id;
    createdAt;
    updatedAt;
    createdBy;
    updatedBy;
    version;
    deletedAt;
    metadata;
    constructor(data = {}) {
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
    isDeleted() {
        return this.deletedAt !== undefined && this.deletedAt !== null;
    }
    /**
     * Soft delete the entity
     */
    softDelete(userId) {
        this.deletedAt = new Date();
        this.updatedBy = userId;
        this.markAsUpdated();
    }
    /**
     * Restore soft deleted entity
     */
    restore(userId) {
        this.deletedAt = undefined;
        this.updatedBy = userId;
        this.markAsUpdated();
    }
    /**
     * Mark entity as updated
     */
    markAsUpdated(userId) {
        this.updatedAt = new Date();
        if (userId) {
            this.updatedBy = userId;
        }
        this.version++;
    }
    /**
     * Add metadata to entity
     */
    addMetadata(key, value) {
        if (!this.metadata) {
            this.metadata = {};
        }
        this.metadata[key] = value;
        this.markAsUpdated();
    }
    /**
     * Get metadata value
     */
    getMetadata(key) {
        return this.metadata?.[key];
    }
    /**
     * Remove metadata key
     */
    removeMetadata(key) {
        if (this.metadata) {
            delete this.metadata[key];
            this.markAsUpdated();
        }
    }
    /**
     * Create audit trail entry for this entity
     */
    createAuditTrail(operation, changes, userId, traceId) {
        const auditTrail = {
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
    toPlainObject() {
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
    clone() {
        const Constructor = this.constructor;
        return new Constructor(this.toPlainObject());
    }
    /**
     * Check if entity equals another entity
     */
    equals(other) {
        return this.id === other.id && this.version === other.version;
    }
    /**
     * Check if entity is newer than another entity
     */
    isNewerThan(other) {
        return this.updatedAt > other.updatedAt;
    }
    /**
     * Get entity type name
     */
    getEntityType() {
        return this.constructor.name;
    }
}
