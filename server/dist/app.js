"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = __importDefault(require("./config/env"));
const swagger_1 = __importDefault(require("./config/swagger"));
const routes_1 = __importDefault(require("./presentation/http/routes"));
const errorHandler_1 = require("./presentation/http/middlewares/errorHandler");
const app = (0, express_1.default)();
app.set('trust proxy', true);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL ?? '*',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '2mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)(env_1.default.nodeEnv === 'production' ? 'combined' : 'dev'));
app.get('/health', (_req, res) => {
    res.json({ trangThai: 'hoat_dong', thoiGian: new Date().toISOString() });
});
// Swagger documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Fishing Shop API Documentation',
}));
app.use('/api', routes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map