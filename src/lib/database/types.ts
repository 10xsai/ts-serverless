/**
 * Database types and interfaces for Cloudflare Workers
 * @description Core database types optimized for serverless environments
 */

import type { DrizzleD1Database } from 'drizzle-orm/d1';

/**
 * Database connection configuration
 */
export interface ConnectionConfig {
    /** Unique connection identifier */
    id: string;
    /** Database type */
    type: 'sqlite' | 'postgres' | 'mysql';
    /** Connection URL or parameters */
    url?: string;
    /** Database name */
    database?: string;
    /** Additional connection options */
    options?: Record<string, unknown>;
    /** Connection timeout in milliseconds */
    timeout?: number;
    /** Maximum number of retries */
    maxRetries?: number;
}

/**
 * Database connection state
 */
export interface DatabaseConnection {
    /** Connection identifier */
    id: string;
    /** Database type */
    type: string;
    /** Connection configuration */
    config: ConnectionConfig;
    /** Connection status */
    isConnected: boolean;
    /** Connection creation timestamp */
    createdAt: Date;
    /** Last used timestamp */
    lastUsed: Date;
    /** Optional error information */
    error?: Error;
}

/**
 * Connection pool interface
 */
export interface ConnectionPool {
    /** Maximum number of connections */
    maxConnections: number;
    /** Current active connections */
    activeConnections: number;
    /** Current idle connections */
    idleConnections: number;
    /** Number of waiting requests */
    waitingRequests: number;
    /** Pool configuration */
    config: {
        maxConnections: number;
        idleTimeout: number;
        acquireTimeout: number;
    };
    /** Pool creation timestamp */
    createdAt: Date;

    /** Acquire a connection from the pool */
    acquire(): Promise<DatabaseConnection>;
    /** Release a connection back to the pool */
    release(connection: DatabaseConnection): Promise<void>;
    /** Close the connection pool */
    close(): Promise<void>;
}

/**
 * Database adapter interface
 */
export interface DatabaseAdapter {
    /** Database type */
    type: string;
    /** Database instance */
    database: DrizzleD1Database | unknown;

    /** Execute a query and return results */
    query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
    /** Execute a statement and return affected rows */
    execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }>;
    /** Execute operations within a transaction */
    transaction<T>(callback: (tx: DatabaseAdapter) => Promise<T>): Promise<T>;
}

/**
 * Database migration interface
 */
export interface Migration {
    /** Migration identifier */
    id: string;
    /** Migration name */
    name: string;
    /** Migration version */
    version: string;
    /** Migration SQL statements */
    up: string[];
    /** Rollback SQL statements */
    down: string[];
    /** Migration timestamp */
    timestamp: Date;
    /** Migration checksum */
    checksum?: string;
}

/**
 * Migration status
 */
export interface MigrationStatus {
    /** Migration identifier */
    id: string;
    /** Applied timestamp */
    appliedAt: Date;
    /** Execution time in milliseconds */
    executionTime: number;
    /** Migration success status */
    success: boolean;
    /** Error message if failed */
    error?: string;
}

/**
 * Schema definition interface
 */
export interface SchemaDefinition {
    /** Schema name */
    name: string;
    /** Schema version */
    version: string;
    /** Table definitions */
    tables: TableDefinition[];
    /** Index definitions */
    indexes?: IndexDefinition[];
    /** Constraint definitions */
    constraints?: ConstraintDefinition[];
}

/**
 * Table definition interface
 */
export interface TableDefinition {
    /** Table name */
    name: string;
    /** Column definitions */
    columns: ColumnDefinition[];
    /** Primary key columns */
    primaryKey?: string[];
    /** Table options */
    options?: Record<string, unknown>;
}

/**
 * Column definition interface
 */
export interface ColumnDefinition {
    /** Column name */
    name: string;
    /** Column type */
    type: string;
    /** Whether column is nullable */
    nullable?: boolean;
    /** Default value */
    default?: unknown;
    /** Column options */
    options?: Record<string, unknown>;
}

/**
 * Index definition interface
 */
export interface IndexDefinition {
    /** Index name */
    name: string;
    /** Table name */
    table: string;
    /** Column names */
    columns: string[];
    /** Whether index is unique */
    unique?: boolean;
    /** Index type */
    type?: string;
}

/**
 * Constraint definition interface
 */
export interface ConstraintDefinition {
    /** Constraint name */
    name: string;
    /** Table name */
    table: string;
    /** Constraint type */
    type: 'foreign_key' | 'unique' | 'check';
    /** Constraint definition */
    definition: string;
}

/**
 * Database health check result
 */
export interface HealthCheckResult {
    /** Health check status */
    status: 'healthy' | 'unhealthy' | 'degraded';
    /** Response time in milliseconds */
    responseTime: number;
    /** Timestamp of check */
    timestamp: Date;
    /** Error message if unhealthy */
    error?: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}

/**
 * Query execution options
 */
export interface QueryOptions {
    /** Query timeout in milliseconds */
    timeout?: number;
    /** Maximum number of retries */
    maxRetries?: number;
    /** Whether to use read replica */
    readReplica?: boolean;
    /** Additional query parameters */
    parameters?: Record<string, unknown>;
} 