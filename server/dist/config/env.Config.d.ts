declare const envConfig: Readonly<{
    PORT: number;
    FRONTEND_URL: string;
    MONGO_URI: string;
    JWT_SECRET: string;
    GLOBAL_ROOM: string;
    PEPPER_SECRET: string;
} & import("envalid").CleanedEnvAccessors>;
export default envConfig;
//# sourceMappingURL=env.Config.d.ts.map