/**
 * Database schema utilities for Cloudflare Workers
 * @description Schema management and validation for serverless environments
 */
/**
 * Schema builder for creating database schemas
 * @description Provides fluent API for building database schemas
 */
export class SchemaBuilder {
    schema;
    constructor(name, version = '1.0.0') {
        this.schema = {
            name,
            version,
            tables: [],
            indexes: [],
            constraints: []
        };
    }
    /**
     * Add a table to the schema
     * @param definition - Table definition
     * @returns Schema builder instance
     */
    addTable(definition) {
        this.schema.tables.push(definition);
        return this;
    }
    /**
     * Add an index to the schema
     * @param definition - Index definition
     * @returns Schema builder instance
     */
    addIndex(definition) {
        if (!this.schema.indexes) {
            this.schema.indexes = [];
        }
        this.schema.indexes.push(definition);
        return this;
    }
    /**
     * Add a constraint to the schema
     * @param definition - Constraint definition
     * @returns Schema builder instance
     */
    addConstraint(definition) {
        if (!this.schema.constraints) {
            this.schema.constraints = [];
        }
        this.schema.constraints.push(definition);
        return this;
    }
    /**
     * Build the final schema definition
     * @returns Complete schema definition
     */
    build() {
        return { ...this.schema };
    }
}
/**
 * Table builder for creating table definitions
 * @description Provides fluent API for building table definitions
 */
export class TableBuilder {
    table;
    constructor(name) {
        this.table = {
            name,
            columns: [],
            primaryKey: [],
            options: {}
        };
    }
    /**
     * Add a column to the table
     * @param definition - Column definition
     * @returns Table builder instance
     */
    addColumn(definition) {
        this.table.columns.push(definition);
        return this;
    }
    /**
     * Set primary key columns
     * @param columns - Primary key column names
     * @returns Table builder instance
     */
    setPrimaryKey(columns) {
        this.table.primaryKey = columns;
        return this;
    }
    /**
     * Add table options
     * @param options - Table options
     * @returns Table builder instance
     */
    setOptions(options) {
        this.table.options = { ...this.table.options, ...options };
        return this;
    }
    /**
     * Build the final table definition
     * @returns Complete table definition
     */
    build() {
        return { ...this.table };
    }
}
/**
 * Column builder for creating column definitions
 * @description Provides fluent API for building column definitions
 */
export class ColumnBuilder {
    column;
    constructor(name, type) {
        this.column = {
            name,
            type,
            nullable: true,
            options: {}
        };
    }
    /**
     * Set column as nullable or not nullable
     * @param nullable - Whether column is nullable
     * @returns Column builder instance
     */
    setNullable(nullable) {
        this.column.nullable = nullable;
        return this;
    }
    /**
     * Set default value for column
     * @param value - Default value
     * @returns Column builder instance
     */
    setDefault(value) {
        this.column.default = value;
        return this;
    }
    /**
     * Add column options
     * @param options - Column options
     * @returns Column builder instance
     */
    setOptions(options) {
        this.column.options = { ...this.column.options, ...options };
        return this;
    }
    /**
     * Build the final column definition
     * @returns Complete column definition
     */
    build() {
        return { ...this.column };
    }
}
/**
 * Schema validator for validating schema definitions
 * @description Validates schema definitions for consistency and correctness
 */
export class SchemaValidator {
    /**
     * Validate a schema definition
     * @param schema - Schema to validate
     * @returns Validation result
     */
    static validate(schema) {
        const errors = [];
        // Validate schema name
        if (!schema.name || typeof schema.name !== 'string') {
            errors.push('Schema name is required and must be a string');
        }
        // Validate schema version
        if (!schema.version || typeof schema.version !== 'string') {
            errors.push('Schema version is required and must be a string');
        }
        // Validate tables
        if (!Array.isArray(schema.tables)) {
            errors.push('Schema tables must be an array');
        }
        else {
            schema.tables.forEach((table, index) => {
                const tableErrors = this.validateTable(table);
                errors.push(...tableErrors.map(err => `Table[${index}]: ${err}`));
            });
        }
        // Validate indexes
        if (schema.indexes && !Array.isArray(schema.indexes)) {
            errors.push('Schema indexes must be an array');
        }
        // Validate constraints
        if (schema.constraints && !Array.isArray(schema.constraints)) {
            errors.push('Schema constraints must be an array');
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
    /**
     * Validate a table definition
     * @param table - Table to validate
     * @returns Validation errors
     */
    static validateTable(table) {
        const errors = [];
        // Validate table name
        if (!table.name || typeof table.name !== 'string') {
            errors.push('Table name is required and must be a string');
        }
        // Validate columns
        if (!Array.isArray(table.columns)) {
            errors.push('Table columns must be an array');
        }
        else if (table.columns.length === 0) {
            errors.push('Table must have at least one column');
        }
        else {
            table.columns.forEach((column, index) => {
                const columnErrors = this.validateColumn(column);
                errors.push(...columnErrors.map(err => `Column[${index}]: ${err}`));
            });
        }
        // Validate primary key
        if (table.primaryKey && !Array.isArray(table.primaryKey)) {
            errors.push('Table primary key must be an array');
        }
        return errors;
    }
    /**
     * Validate a column definition
     * @param column - Column to validate
     * @returns Validation errors
     */
    static validateColumn(column) {
        const errors = [];
        // Validate column name
        if (!column.name || typeof column.name !== 'string') {
            errors.push('Column name is required and must be a string');
        }
        // Validate column type
        if (!column.type || typeof column.type !== 'string') {
            errors.push('Column type is required and must be a string');
        }
        return errors;
    }
}
/**
 * Create a new schema builder
 * @param name - Schema name
 * @param version - Schema version
 * @returns Schema builder instance
 */
export function createSchema(name, version) {
    return new SchemaBuilder(name, version);
}
/**
 * Create a new table builder
 * @param name - Table name
 * @returns Table builder instance
 */
export function createTable(name) {
    return new TableBuilder(name);
}
/**
 * Create a new column builder
 * @param name - Column name
 * @param type - Column type
 * @returns Column builder instance
 */
export function createColumn(name, type) {
    return new ColumnBuilder(name, type);
}
