import type { NextFunction, Request, Response } from 'express';
declare const socketAuth: (socket: any, next: (err?: Error) => void) => Promise<void>;
export default socketAuth;
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map