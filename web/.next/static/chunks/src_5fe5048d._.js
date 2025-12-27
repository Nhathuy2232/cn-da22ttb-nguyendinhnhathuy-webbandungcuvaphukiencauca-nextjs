(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiClient",
    ()=>apiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
const API_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
class ApiClient {
    getAuthToken() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return localStorage.getItem('accessToken');
    }
    async request(endpoint) {
        let config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const { requiresAuth = false, headers = {}, ...restConfig } = config;
        const requestHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };
        if (requiresAuth) {
            const token = this.getAuthToken();
            if (token) {
                requestHeaders['Authorization'] = "Bearer ".concat(token);
            }
        }
        const response = await fetch("".concat(this.baseUrl).concat(endpoint), {
            ...restConfig,
            headers: requestHeaders
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({
                    success: false,
                    message: 'An error occurred'
                }));
            // Nếu là lỗi 401 (unauthorized), có thể xóa token
            if (response.status === 401 && "object" !== 'undefined') {
                localStorage.removeItem('accessToken');
            }
            throw new Error(error.message || "HTTP ".concat(response.status));
        }
        return response.json();
    }
    // Các endpoint xác thực
    async register(data) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async login(data) {
        var _response_data;
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if ((_response_data = response.data) === null || _response_data === void 0 ? void 0 : _response_data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        return response;
    }
    async logout() {
        const response = await this.request('/auth/logout', {
            method: 'POST',
            requiresAuth: true
        });
        localStorage.removeItem('accessToken');
        return response;
    }
    async getMe() {
        return this.request('/auth/me', {
            requiresAuth: true
        });
    }
    // Các endpoint sản phẩm
    async getProducts(params) {
        const queryParams = new URLSearchParams();
        if (params === null || params === void 0 ? void 0 : params.search) queryParams.set('search', params.search);
        if (params === null || params === void 0 ? void 0 : params.category) queryParams.set('category', params.category);
        if (params === null || params === void 0 ? void 0 : params.page) queryParams.set('page', params.page.toString());
        if (params === null || params === void 0 ? void 0 : params.limit) queryParams.set('limit', params.limit.toString());
        const query = queryParams.toString();
        return this.request("/products".concat(query ? "?".concat(query) : ''));
    }
    async getProduct(id) {
        return this.request("/products/".concat(id));
    }
    // Các endpoint danh mục
    async getCategories() {
        return this.request('/categories');
    }
    async getCategory(id) {
        return this.request("/categories/".concat(id));
    }
    // Flash sales
    async getActiveFlashSales() {
        return this.request('/flash-sales/active');
    }
    // Các endpoint giỏ hàng
    async getCart() {
        return this.request('/cart', {
            requiresAuth: true
        });
    }
    async addToCart(data) {
        return this.request('/cart', {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth: true
        });
    }
    async updateCartItem(productId, quantity) {
        return this.request("/cart", {
            method: 'PUT',
            body: JSON.stringify({
                product_id: productId,
                quantity
            }),
            requiresAuth: true
        });
    }
    async removeCartItem(id) {
        return this.request("/cart/".concat(id), {
            method: 'DELETE',
            requiresAuth: true
        });
    }
    async clearCart() {
        return this.request('/cart', {
            method: 'DELETE',
            requiresAuth: true
        });
    }
    // Các endpoint đơn hàng
    async createOrder(data) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(data),
            requiresAuth: true
        });
    }
    async getOrders() {
        return this.request('/orders', {
            requiresAuth: true
        });
    }
    async getOrder(id) {
        return this.request("/orders/".concat(id), {
            requiresAuth: true
        });
    }
    constructor(baseUrl){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "baseUrl", void 0);
        this.baseUrl = baseUrl;
    }
}
const apiClient = new ApiClient(API_BASE_URL);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useAuth.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider(param) {
    let { children } = param;
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            async function loadUser() {
                try {
                    const token = localStorage.getItem('accessToken');
                    if (token) {
                        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].getMe();
                        if (response.success) {
                            setUser(response.data);
                        } else {
                            // Token không hợp lệ, xóa nó
                            localStorage.removeItem('accessToken');
                        }
                    }
                } catch (error) {
                    // Token hết hạn hoặc không hợp lệ, xóa nó một cách im lặng
                    console.log('Token đã hết hạn hoặc không hợp lệ');
                    localStorage.removeItem('accessToken');
                    setUser(null);
                } finally{
                    setLoading(false);
                }
            }
            loadUser();
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].login({
                email,
                password
            });
            if (response.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            throw error;
        }
    };
    const register = async (fullName, email, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].register({
                full_name: fullName,
                email,
                password
            });
            if (response.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            throw error;
        }
    };
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally{
            setUser(null);
            localStorage.removeItem('accessToken');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            login,
            register,
            logout,
            isAuthenticated: !!user
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/hooks/useAuth.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_5fe5048d._.js.map