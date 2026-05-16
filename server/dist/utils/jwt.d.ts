interface JwtPayload {
    userId: string;
}
export declare const verifyToken: (token: string) => JwtPayload;
export declare const signToken: (userId: string) => string;
export {};
//# sourceMappingURL=jwt.d.ts.map