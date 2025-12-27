"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
const logger_1 = __importDefault(require("./config/logger"));
const database_1 = __importDefault(require("./infrastructure/database"));
const server = http_1.default.createServer(app_1.default);
const bootstrap = async () => {
    try {
        const connection = await database_1.default.getConnection();
        connection.release();
        server.listen(env_1.default.port, () => {
            logger_1.default.info(`API server running on http://localhost:${env_1.default.port}`);
        });
    }
    catch (error) {
        logger_1.default.error({ error }, 'Failed to start server');
        process.exit(1);
    }
};
bootstrap();
//# sourceMappingURL=server.js.map