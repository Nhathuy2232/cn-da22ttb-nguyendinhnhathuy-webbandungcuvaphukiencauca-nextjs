"use strict";
/**
 * Index file - Export tất cả các middlewares
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.authorize = exports.authenticate = void 0;
var authMiddleware_1 = require("./authMiddleware");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return authMiddleware_1.authenticate; } });
Object.defineProperty(exports, "authorize", { enumerable: true, get: function () { return authMiddleware_1.authorize; } });
var errorHandler_1 = require("./errorHandler");
Object.defineProperty(exports, "errorHandler", { enumerable: true, get: function () { return errorHandler_1.errorHandler; } });
//# sourceMappingURL=index.js.map