"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = __importDefault(require("../config/env"));
const logger_1 = __importDefault(require("../config/logger"));
const pool = promise_1.default.createPool({
    host: env_1.default.database.host,
    port: env_1.default.database.port,
    user: env_1.default.database.user,
    password: env_1.default.database.password,
    database: env_1.default.database.database,
    waitForConnections: true,
    connectionLimit: env_1.default.database.connectionLimit,
    namedPlaceholders: false,
    charset: 'utf8mb4',
    acquireTimeoutMillis: 60000,
    queryTimeout: 60000,
    connectTimeout: 60000,
});
pool.on('connection', () => {
    logger_1.default.debug('MySQL connection established');
});
exports.default = pool;
//# sourceMappingURL=database.js.map