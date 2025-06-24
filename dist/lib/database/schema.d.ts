/**
 * Database schema utilities for Cloudflare Workers
 * @description Schema management and validation for serverless environments
 */
import type { SchemaDefinition, TableDefinition, ColumnDefinition, IndexDefinition, ConstraintDefinition } from './types.js';
/**
 * Schema builder for creating database schemas
 * @description Provides fluent API for building database schemas
 */
export declare class SchemaBuilder {
    private schema;
    constructor(name: string, version?: string);
    /**
     * Add a table to the schema
     * @param definition - Table definition
     * @returns Schema builder instance
     */
    addTable(definition: TableDefinition): this;
    /**
     * Add an index to the schema
     * @param definition - Index definition
     * @returns Schema builder instance
     */
    addIndex(definition: IndexDefinition): this;
    /**
     * Add a constraint to the schema
     * @param definition - Constraint definition
     * @returns Schema builder instance
     */
    addConstraint(definition: ConstraintDefinition): this;
    /**
     * Build the final schema definition
     * @returns Complete schema definition
     */
    build(): SchemaDefinition;
}
/**
 * Table builder for creating table definitions
 * @description Provides fluent API for building table definitions
 */
export declare class TableBuilder {
    private table;
    constructor(name: string);
    /**
     * Add a column to the table
     * @param definition - Column definition
     * @returns Table builder instance
     */
    addColumn(definition: ColumnDefinition): this;
    /**
     * Set primary key columns
     * @param columns - Primary key column names
     * @returns Table builder instance
     */
    setPrimaryKey(columns: string[]): this;
    /**
     * Add table options
     * @param options - Table options
     * @returns Table builder instance
     */
    setOptions(options: Record<string, unknown>): this;
    /**
     * Build the final table definition
     * @returns Complete table definition
     */
    build(): TableDefinition;
}
/**
 * Column builder for creating column definitions
 * @description Provides fluent API for building column definitions
 */
export declare class ColumnBuilder {
    private column;
    constructor(name: string, type: string);
    /**
     * Set column as nullable or not nullable
     * @param nullable - Whether column is nullable
     * @returns Column builder instance
     */
    setNullable(nullable: boolean): this;
    /**
     * Set default value for column
     * @param value - Default value
     * @returns Column builder instance
     */
    setDefault(value: unknown): this;
    /**
     * Add column options
     * @param options - Column options
     * @returns Column builder instance
     */
    setOptions(options: Record<string, unknown>): this;
    /**
     * Build the final column definition
     * @returns Complete column definition
     */
    build(): ColumnDefinition;
}
/**
 * Schema validator for validating schema definitions
 * @description Validates schema definitions for consistency and correctness
 */
export declare class SchemaValidator {
    /**
     * Validate a schema definition
     * @param schema - Schema to validate
     * @returns Validation result
     */
    static validate(schema: SchemaDefinition): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Validate a table definition
     * @param table - Table to validate
     * @returns Validation errors
     */
    private static validateTable;
    /**
     * Validate a column definition
     * @param column - Column to validate
     * @returns Validation errors
     */
    private static validateColumn;
}
/**
 * Create a new schema builder
 * @param name - Schema name
 * @param version - Schema version
 * @returns Schema builder instance
 */
export declare function createSchema(name: string, version?: string): SchemaBuilder;
/**
 * Create a new table builder
 * @param name - Table name
 * @returns Table builder instance
 */
export declare function createTable(name: string): TableBuilder;
/**
 * Create a new column builder
 * @param name - Column name
 * @param type - Column type
 * @returns Column builder instance
 */
export declare function createColumn(name: string, type: string): ColumnBuilder;
