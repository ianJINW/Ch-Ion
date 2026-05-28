import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
/**
 * Validates request body against a schema
 */
export declare const validateBody: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
/**
 * Validates query parameters against a schema
 */
export declare const validateQuery: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.d.ts.map