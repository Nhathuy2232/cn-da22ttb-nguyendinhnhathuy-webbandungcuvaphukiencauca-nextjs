"use strict";
/**
 * Index file - Export tất cả các external services
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ghnService = exports.emailService = void 0;
var EmailServiceImpl_1 = require("./EmailServiceImpl");
Object.defineProperty(exports, "emailService", { enumerable: true, get: function () { return __importDefault(EmailServiceImpl_1).default; } });
var GHNServiceImpl_1 = require("./GHNServiceImpl");
Object.defineProperty(exports, "ghnService", { enumerable: true, get: function () { return __importDefault(GHNServiceImpl_1).default; } });
//# sourceMappingURL=index.js.map