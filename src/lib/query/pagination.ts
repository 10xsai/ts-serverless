import type { PaginatedResult, PaginationOptions } from '../types.js';
import { calculateOffset, calculateTotalPages } from '../utils/helpers.js';

/**
 * Pagination helper utilities
 */
export class PaginationHelper {
    /**
     * Create pagination from options
     */
    static createPagination(
        data: unknown[],
        total: number,
        options: PaginationOptions
    ): PaginatedResult<unknown> {
        const page = options.page || 1;
        const limit = options.limit || 10;
        const totalPages = calculateTotalPages(total, limit);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }

    /**
     * Calculate offset from page and limit
     */
    static getOffset(page: number, limit: number): number {
        return calculateOffset(page, limit);
    }

    /**
     * Get pagination metadata
     */
    static getPaginationMeta(page: number, limit: number, total: number) {
        const totalPages = calculateTotalPages(total, limit);
        const offset = calculateOffset(page, limit);

        return {
            page,
            limit,
            total,
            totalPages,
            offset,
            hasNext: page < totalPages,
            hasPrev: page > 1,
            isFirstPage: page === 1,
            isLastPage: page === totalPages,
        };
    }

    /**
     * Validate pagination options
     */
    static validatePagination(options: PaginationOptions): void {
        if (options.page && options.page < 1) {
            throw new Error('Page must be greater than 0');
        }
        if (options.limit && options.limit < 1) {
            throw new Error('Limit must be greater than 0');
        }
        if (options.limit && options.limit > 100) {
            throw new Error('Limit cannot exceed 100');
        }
    }
}

/**
 * Create cursor-based pagination
 */
export const createCursorPagination = <T>(
    data: T[],
    getCursor: (item: T) => string,
    limit: number
): { data: T[]; nextCursor?: string; hasPrev: boolean } => {
    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, -1) : data;
    const nextCursor = hasMore && items.length > 0 ? getCursor(items[items.length - 1]) : undefined;

    return {
        data: items,
        nextCursor,
        hasPrev: false, // Would need previous cursor to determine this
    };
}; 