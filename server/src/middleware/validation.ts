import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import logger from '../utils/logger.js';

/**
 * Validates request body against a schema
 */
export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Validation error:', error.issues);
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.issues.map((issue: any) => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        });
      }

      logger.error('Unknown validation error:', error);
      return res.status(500).json({ message: 'Validation error' });
    }
  };
};

/**
 * Validates query parameters against a schema
 */
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn('Query validation error:', error.issues);
        return res.status(400).json({
          message: 'Invalid query parameters',
          errors: error.issues.map((issue: any) => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        });
      }

      return res.status(500).json({ message: 'Query validation error' });
    }
  };
};
