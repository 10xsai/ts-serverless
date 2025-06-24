/**
 * Database migration utilities for Cloudflare Workers
 * @description Migration management and execution for serverless environments
 */
/**
 * Migration manager for database schema changes
 * @description Manages database migrations in serverless environments
 */
export class MigrationManager {
    adapter;
    migrations = new Map();
    constructor(adapter) {
        this.adapter = adapter;
    }
    /**
     * Register a migration
     * @param migration - Migration to register
     * @returns Migration manager instance
     */
    register(migration) {
        this.migrations.set(migration.id, migration);
        return this;
    }
    /**
     * Register multiple migrations
     * @param migrations - Migrations to register
     * @returns Migration manager instance
     */
    registerAll(migrations) {
        migrations.forEach(migration => this.register(migration));
        return this;
    }
    /**
     * Get all registered migrations
     * @returns Array of migrations
     */
    getMigrations() {
        return Array.from(this.migrations.values()).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
    /**
     * Get migration by ID
     * @param id - Migration ID
     * @returns Migration or undefined
     */
    getMigration(id) {
        return this.migrations.get(id);
    }
    /**
     * Check if migration exists
     * @param id - Migration ID
     * @returns Whether migration exists
     */
    hasMigration(id) {
        return this.migrations.has(id);
    }
    /**
     * Get pending migrations
     * @returns Array of pending migrations
     */
    async getPendingMigrations() {
        const applied = await this.getAppliedMigrations();
        const appliedIds = new Set(applied.map(status => status.id));
        return this.getMigrations().filter(migration => !appliedIds.has(migration.id));
    }
    /**
     * Get applied migrations
     * @returns Array of applied migration statuses
     */
    async getAppliedMigrations() {
        try {
            // Query the migrations table to get applied migrations
            const results = await this.adapter.query('SELECT * FROM _migrations ORDER BY appliedAt ASC');
            return results;
        }
        catch (error) {
            // If migrations table doesn't exist, return empty array
            if (error instanceof Error && error.message.includes('no such table')) {
                return [];
            }
            throw error;
        }
    }
    /**
     * Execute a single migration
     * @param migration - Migration to execute
     * @returns Migration execution result
     */
    async executeMigration(migration) {
        const startTime = Date.now();
        try {
            // Execute migration within a transaction
            await this.adapter.transaction(async (tx) => {
                // Execute all up statements
                for (const statement of migration.up) {
                    await tx.execute(statement);
                }
                // Record migration as applied
                await tx.execute('INSERT INTO _migrations (id, appliedAt, executionTime, success) VALUES (?, ?, ?, ?)', [migration.id, new Date(), Date.now() - startTime, true]);
            });
            return {
                id: migration.id,
                appliedAt: new Date(),
                executionTime: Date.now() - startTime,
                success: true
            };
        }
        catch (error) {
            const status = {
                id: migration.id,
                appliedAt: new Date(),
                executionTime: Date.now() - startTime,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
            // Record failed migration
            try {
                await this.adapter.execute('INSERT INTO _migrations (id, appliedAt, executionTime, success, error) VALUES (?, ?, ?, ?, ?)', [migration.id, status.appliedAt, status.executionTime, false, status.error]);
            }
            catch {
                // Ignore error if we can't record the failure
            }
            throw error;
        }
    }
    /**
     * Rollback a migration
     * @param migration - Migration to rollback
     * @returns Migration rollback result
     */
    async rollbackMigration(migration) {
        const startTime = Date.now();
        // Execute rollback within a transaction
        await this.adapter.transaction(async (tx) => {
            // Execute all down statements
            for (const statement of migration.down) {
                await tx.execute(statement);
            }
            // Remove migration from applied migrations
            await tx.execute('DELETE FROM _migrations WHERE id = ?', [migration.id]);
        });
        return {
            id: migration.id,
            appliedAt: new Date(),
            executionTime: Date.now() - startTime,
            success: true
        };
    }
    /**
     * Run all pending migrations
     * @returns Array of migration results
     */
    async migrate() {
        // Ensure migrations table exists
        await this.ensureMigrationsTable();
        const pending = await this.getPendingMigrations();
        const results = [];
        for (const migration of pending) {
            const result = await this.executeMigration(migration);
            results.push(result);
        }
        return results;
    }
    /**
     * Rollback the last migration
     * @returns Migration rollback result
     */
    async rollback() {
        const applied = await this.getAppliedMigrations();
        if (applied.length === 0) {
            return null;
        }
        const lastApplied = applied[applied.length - 1];
        const migration = this.getMigration(lastApplied.id);
        if (!migration) {
            throw new Error(`Migration ${lastApplied.id} not found`);
        }
        return await this.rollbackMigration(migration);
    }
    /**
     * Ensure migrations table exists
     * @private
     */
    async ensureMigrationsTable() {
        await this.adapter.execute(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id TEXT PRIMARY KEY,
        appliedAt DATETIME NOT NULL,
        executionTime INTEGER NOT NULL,
        success BOOLEAN NOT NULL,
        error TEXT
      )
    `);
    }
}
/**
 * Migration builder for creating migrations
 * @description Provides fluent API for building migrations
 */
export class MigrationBuilder {
    migration;
    constructor(id, name) {
        this.migration = {
            id,
            name,
            version: '1.0.0',
            up: [],
            down: [],
            timestamp: new Date()
        };
    }
    /**
     * Set migration version
     * @param version - Migration version
     * @returns Migration builder instance
     */
    setVersion(version) {
        this.migration.version = version;
        return this;
    }
    /**
     * Add up statement
     * @param statement - SQL statement for migration
     * @returns Migration builder instance
     */
    addUp(statement) {
        if (!this.migration.up) {
            this.migration.up = [];
        }
        this.migration.up.push(statement);
        return this;
    }
    /**
     * Add down statement
     * @param statement - SQL statement for rollback
     * @returns Migration builder instance
     */
    addDown(statement) {
        if (!this.migration.down) {
            this.migration.down = [];
        }
        this.migration.down.push(statement);
        return this;
    }
    /**
     * Set migration timestamp
     * @param timestamp - Migration timestamp
     * @returns Migration builder instance
     */
    setTimestamp(timestamp) {
        this.migration.timestamp = timestamp;
        return this;
    }
    /**
     * Build the final migration
     * @returns Complete migration
     */
    build() {
        const { id, name, version, up, down, timestamp } = this.migration;
        if (!id || !name || !version || !up || !down || !timestamp) {
            throw new Error('Migration is incomplete');
        }
        return {
            id,
            name,
            version,
            up,
            down,
            timestamp
        };
    }
}
/**
 * Create a new migration builder
 * @param id - Migration ID
 * @param name - Migration name
 * @returns Migration builder instance
 */
export function createMigration(id, name) {
    return new MigrationBuilder(id, name);
}
/**
 * Create a migration manager
 * @param adapter - Database adapter
 * @returns Migration manager instance
 */
export function createMigrationManager(adapter) {
    return new MigrationManager(adapter);
}
