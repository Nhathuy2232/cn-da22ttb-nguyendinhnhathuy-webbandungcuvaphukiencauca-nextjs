declare const env: {
    nodeEnv: string;
    port: number;
    jwt: {
        secret: string;
        expiresIn: string;
    };
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        connectionLimit: number;
    };
    pagination: {
        defaultLimit: number;
    };
    ghn: {
        baseUrl: string;
        shopId: string;
        token: string;
        phone: string;
    };
};
export type Env = typeof env;
export default env;
//# sourceMappingURL=env.d.ts.map