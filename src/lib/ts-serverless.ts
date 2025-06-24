// Core Framework - Main exports
export * from './base/index.js';
export * from './database/index.js';
export * from './errors/index.js';
export * from './query/index.js';
export * from './security/index.js';
export * from './utils/index.js';

// Export validation functions
export {
  validators,
  validate
} from './validation/validators.js';

// Export validation schemas
export {
  CommonSchemas,
  BaseEntitySchema,
  PaginationSchema,
  SortSchema,
  FilterConditionSchema,
  FilterCriteriaSchema,
  SearchQuerySchema
} from './validation/schemas.js';

// Export validation types
export type {
  ValidationSchema,
  ValidationResult,
  ValidationContext,
  ValidationRule,
  ValidationRuleConfig,
  FieldValidationConfig,
  EntityValidationConfig,
  ValidationOptions,
  ValidationResultInterface,
  Validator,
  ValidationRegistry
} from './validation/types.js';

// Export main types
export type {
  Brand,
  EntityId,
  UserId,
  TenantId,
  TraceId,
  Nullable,
  Optional,
  DeepPartial,
  BaseEntity,
  AuditTrail,
  PaginationOptions,
  PaginatedResult,
  SearchQuery,
  SearchResult,
  CreateOptions,
  UpdateOptions,
  DeleteOptions,
  FindOptions,
  ListOptions,
  SortCriteria,
  FilterOperator,
  FilterCondition,
  FilterCriteria,
  ErrorContext,
  ValidationIssue,
  ApiResponse,
  ApiError,

  HealthCheck,
  createEntityId,
  createUserId,
  createTenantId,
  createTraceId
} from './types.js';
