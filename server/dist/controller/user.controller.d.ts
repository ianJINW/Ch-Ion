import { type Request, type Response } from "express";
export declare const createUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const me: (req: Request, res: Response) => Promise<void>;
export declare const logOut: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map