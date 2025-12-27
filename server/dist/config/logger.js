"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const loggerOptions = {
    level: process.env.LOG_LEVEL ?? 'info',
};
if (process.env.NODE_ENV !== 'production') {
    loggerOptions.transport = {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
        },
    };
}
const logger = (0, pino_1.default)(loggerOptions);
exports.default = logger;
//# sourceMappingURL=logger.js.map