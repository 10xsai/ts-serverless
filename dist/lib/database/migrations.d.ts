/**
 * Database migration utilities for Cloudflare Workers
 * @description Migration management and execution for serverless environments
 */
import type { Migration, MigrationStatus, DatabaseAdapter } from './types.js';
/**
 * Migration manager for database schema changes
 * @description Manages database migrations in serverless environments
 */
export declare class MigrationManager {
    private adapter;
    private migrations;
    constructor(adapter: DatabaseAdapter);
    /**
     * Register a migration
     * @param migration - Migration to register
     * @returns Migration manager instance
     */
    register(migration: Migration): this;
    /**
     * Register multiple migrations
     * @param migrations - Migrations to register
     * @returns Migration manager instance
     */
    registerAll(migrations: Migration[]): this;
    /**
     * Get all registered migrations
     * @returns Array of migrations
     */
    getMigrations(): Migration[];
    /**
     * Get migration by ID
     * @param id - Migration ID
     * @returns Migration or undefined
     */
    getMigration(id: string): Migration | undefined;
    /**
     * Check if migration exists
     * @param id - Migration ID
     * @returns Whether migration exists
     */
    hasMigration(id: string): boolean;
    /**
     * Get pending migrations
     * @returns Array of pending migrations
     */
    getPendingMigrations(): Promise<Migration[]>;
    /**
     * Get applied migrations
     * @returns Array of applied migration statuses
     */
    getAppliedMigrations(): Promise<MigrationStatus[]>;
    /**
     * Execute a single migration
     * @param migration - Migration to execute
     * @returns Migration execution result
     */
    executeMigration(migration: Migration): Promise<MigrationStatus>;
    /**
     * Rollback a migration
     * @param migration - Migration to rollback
     * @returns Migration rollback result
     */
    rollbackMigration(migration: Migration): Promise<MigrationStatus>;
    /**
     * Run all pending migrations
     * @returns Array of migration results
     */
    migrate(): Promise<MigrationStatus[]>;
    /**
     * Rollback the last migration
     * @returns Migration rollback result
     */
    rollback(): Promise<MigrationStatus | null>;
    /**
     * Ensure migrations table exists
     * @private
     */
    private ensureMigrationsTable;
}
/**
 * Migration builder for creating migrations
 * @description Provides fluent API for building migrations
 */
export declare class MigrationBuilder {
    private migration;
    constructor(id: string, name: string);
    /**
     * Set migration version
     * @param version - Migration version
     * @returns Migration builder instance
     */
    setVersion(version: string): this;
    /**
     * Add up statement
     * @param statement - SQL statement for migration
     * @returns Migration builder instance
     */
    addUp(statement: string): this;
    /**
     * Add down statement
     * @param statement - SQL statement for rollback
     * @returns Migration builder instance
     */
    addDown(statement: string): this;
    /**
     * Set migration timestamp
     * @param timestamp - Migration timestamp
     * @returns Migration builder instance
     */
    setTimestamp(timestamp: Date): this;
    /**
     * Build the final migration
     * @returns Complete migration
     */
    build(): Migration;
}
/**
 * Create a new migration builder
 * @param id - Migration ID
 * @param name - Migration name
 * @returns Migration builder instance
 */
export declare function createMigration(id: string, name: string): MigrationBuilder;
/**
 * Create a migration manager
 * @param adapter - Database adapter
 * @returns Migration manager instance
 */
export declare function createMigrationManager(adapter: DatabaseAdapter): MigrationManager;
