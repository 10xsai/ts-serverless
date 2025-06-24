import type { PaginatedResult, PaginationOptions } from '../types.js';
/**
 * Pagination helper utilities
 */
export declare class PaginationHelper {
    /**
     * Create pagination from options
     */
    static createPagination(data: unknown[], total: number, options: PaginationOptions): PaginatedResult<unknown>;
    /**
     * Calculate offset from page and limit
     */
    static getOffset(page: number, limit: number): number;
    /**
     * Get pagination metadata
     */
    static getPaginationMeta(page: number, limit: number, total: number): {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        offset: number;
        hasNext: boolean;
        hasPrev: boolean;
        isFirstPage: boolean;
        isLastPage: boolean;
    };
    /**
     * Validate pagination options
     */
    static validatePagination(options: PaginationOptions): void;
}
/**
 * Create cursor-based pagination
 */
export declare const createCursorPagination: <T>(data: T[], getCursor: (item: T) => string, limit: number) => {
    data: T[];
    nextCursor?: string;
    hasPrev: boolean;
};
