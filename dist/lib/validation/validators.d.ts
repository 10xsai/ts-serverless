import { z } from 'zod';
import type { ValidationSchema, ValidationResult } from '../types.js';
/**
 * Basic validators using Zod
 */
export declare const validators: {
    string: () => z.ZodString;
    number: () => z.ZodNumber;
    boolean: () => z.ZodBoolean;
    email: () => z.ZodString;
    url: () => z.ZodString;
    uuid: () => z.ZodString;
    date: () => z.ZodDate;
    optional: <T>(schema: z.ZodType<T>) => z.ZodOptional<z.ZodType<T, z.ZodTypeDef, T>>;
    array: <T>(schema: z.ZodType<T>) => z.ZodArray<z.ZodType<T, z.ZodTypeDef, T>, "many">;
    object: <T>(shape: Record<string, z.ZodType<any>>) => z.ZodObject<Record<string, z.ZodType<any, z.ZodTypeDef, any>>, "strip", z.ZodTypeAny, {
        [x: string]: any;
    }, {
        [x: string]: any;
    }>;
};
/**
 * Validate data against a schema
 */
export declare const validate: <T>(schema: ValidationSchema<T>, data: unknown) => ValidationResult<T>;
