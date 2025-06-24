import { z } from 'zod';
import type { ValidationSchema, ValidationResult } from '../types.js';

/**
 * Basic validators using Zod
 */
export const validators = {
    string: () => z.string(),
    number: () => z.number(),
    boolean: () => z.boolean(),
    email: () => z.string().email(),
    url: () => z.string().url(),
    uuid: () => z.string().uuid(),
    date: () => z.date(),
    optional: <T>(schema: z.ZodType<T>) => schema.optional(),
    array: <T>(schema: z.ZodType<T>) => z.array(schema),
    object: <T>(shape: Record<string, z.ZodType<any>>) => z.object(shape),
};

/**
 * Validate data against a schema
 */
export const validate = <T>(
    schema: ValidationSchema<T>,
    data: unknown
): ValidationResult<T> => {
    return schema.safeParse(data);
}; 