import type { z } from 'zod';
import type { ValidationIssue } from '../types.js';

/**
 * Validation schema type
 */
export type ValidationSchema<T> = z.ZodType<T>;

/**
 * Validation result type
 */
export type ValidationResult<T> = z.SafeParseReturnType<unknown, T>;

/**
 * Validation context
 */
export interface ValidationContext {
    path?: string[];
    field?: string;
    operation?: string;
    entityType?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Validation rule function
 */
export type ValidationRule<T = unknown> = (
    value: T,
    context?: ValidationContext
) => ValidationIssue[];

/**
 * Validation rule configuration
 */
export interface ValidationRuleConfig<T = unknown> {
    name: string;
    rule: ValidationRule<T>;
    message?: string;
    optional?: boolean;
    priority?: number;
}

/**
 * Field validation configuration
 */
export interface FieldValidationConfig {
    field: string;
    rules: ValidationRuleConfig[];
    transform?: (value: unknown) => unknown;
    optional?: boolean;
}

/**
 * Entity validation configuration
 */
export interface EntityValidationConfig {
    entityType: string;
    fields: FieldValidationConfig[];
    crossFieldRules?: ValidationRuleConfig[];
    customRules?: ValidationRuleConfig[];
}

/**
 * Validation options
 */
export interface ValidationOptions {
    skipUnknownFields?: boolean;
    abortEarly?: boolean;
    stripUnknown?: boolean;
    allowDirty?: boolean;
    context?: ValidationContext;
}

/**
 * Validation result interface
 */
export interface ValidationResultInterface<T> {
    success: boolean;
    data?: T;
    errors: ValidationIssue[];
    warnings?: ValidationIssue[];
}

/**
 * Validator interface
 */
export interface Validator<T> {
    validate(data: unknown, options?: ValidationOptions): ValidationResultInterface<T>;
    validateAsync(data: unknown, options?: ValidationOptions): Promise<ValidationResultInterface<T>>;
    addRule(rule: ValidationRuleConfig): void;
    removeRule(ruleName: string): void;
    getSchema(): ValidationSchema<T>;
}

/**
 * Validation registry interface
 */
export interface ValidationRegistry {
    register<T>(entityType: string, config: EntityValidationConfig): void;
    unregister(entityType: string): void;
    getValidator<T>(entityType: string): Validator<T> | undefined;
    hasValidator(entityType: string): boolean;
    listEntityTypes(): string[];
}

/**
 * Built-in validation rule names
 */
export type BuiltInValidationRules =
    | 'required'
    | 'minLength'
    | 'maxLength'
    | 'min'
    | 'max'
    | 'email'
    | 'url'
    | 'uuid'
    | 'date'
    | 'numeric'
    | 'alpha'
    | 'alphanumeric'
    | 'regex'
    | 'oneOf'
    | 'array'
    | 'object'
    | 'custom';

/**
 * Validation error details
 */
export interface ValidationErrorDetails {
    field: string;
    value: unknown;
    rule: string;
    message: string;
    path: string[];
    context?: ValidationContext;
}

/**
 * Validation rule builder interface
 */
export interface ValidationRuleBuilder<T> {
    required(message?: string): ValidationRuleBuilder<T>;
    optional(): ValidationRuleBuilder<T>;
    minLength(min: number, message?: string): ValidationRuleBuilder<T>;
    maxLength(max: number, message?: string): ValidationRuleBuilder<T>;
    min(min: number, message?: string): ValidationRuleBuilder<T>;
    max(max: number, message?: string): ValidationRuleBuilder<T>;
    email(message?: string): ValidationRuleBuilder<T>;
    url(message?: string): ValidationRuleBuilder<T>;
    uuid(message?: string): ValidationRuleBuilder<T>;
    regex(pattern: RegExp, message?: string): ValidationRuleBuilder<T>;
    oneOf(values: T[], message?: string): ValidationRuleBuilder<T>;
    custom(rule: ValidationRule<T>, message?: string): ValidationRuleBuilder<T>;
    build(): ValidationRuleConfig<T>;
} 