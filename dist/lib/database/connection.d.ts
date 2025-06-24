/**
 * Database connection utilities for Cloudflare Workers
 * @description Provides database connection management optimized for serverless environments
 */
import type { DatabaseConnection, ConnectionConfig, ConnectionPool, DatabaseAdapter } from './types.js';
/**
 * Database connection manager for Cloudflare Workers
 * @description Manages database connections in serverless environments
 */
export declare class ConnectionManager {
    private static instance;
    private connections;
    private constructor();
    /**
     * Get singleton instance of connection manager
     */
    static getInstance(): ConnectionManager;
    /**
     * Create a new database connection
     * @param config - Connection configuration
     * @returns Database connection
     */
    createConnection(config: ConnectionConfig): Promise<DatabaseConnection>;
    /**
     * Get existing connection by ID
     * @param id - Connection ID
     * @returns Database connection or undefined
     */
    getConnection(id: string): DatabaseConnection | undefined;
    /**
     * Close connection
     * @param id - Connection ID
     */
    closeConnection(id: string): Promise<void>;
    /**
     * Get all active connections
     * @returns Array of active connections
     */
    getActiveConnections(): DatabaseConnection[];
}
/**
 * Create a connection pool for database management
 * @param config - Pool configuration
 * @returns Connection pool
 */
export declare function createConnectionPool(config: {
    maxConnections: number;
    idleTimeout: number;
    acquireTimeout: number;
}): ConnectionPool;
/**
 * Database adapter for Cloudflare D1
 * @param database - D1 database instance
 * @returns Database adapter
 */
export declare function createD1Adapter(database: D1Database): DatabaseAdapter;
/**
 * Default connection manager instance
 */
export declare const connectionManager: ConnectionManager;
