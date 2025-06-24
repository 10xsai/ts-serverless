import { z } from 'zod';
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
    optional: (schema) => schema.optional(),
    array: (schema) => z.array(schema),
    object: (shape) => z.object(shape),
};
/**
 * Validate data against a schema
 */
export const validate = (schema, data) => {
    return schema.safeParse(data);
};
