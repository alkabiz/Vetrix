module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/config/config.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VALID_ROLES",
    ()=>VALID_ROLES,
    "authConfig",
    ()=>authConfig
]);
const authConfig = {
    JWT_SECRET: (()=>{
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('Se requiere la variable de entorno JWT_SECRET.');
        }
        return secret;
    })(),
    JWT_EXPIRATION: '24h',
    BCRYPT_ROUNDS: 12
};
const VALID_ROLES = [
    'admin',
    'vet',
    'assistant'
];
}),
"[project]/lib/auth/token-service.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "blacklistToken",
    ()=>blacklistToken,
    "generateAccessToken",
    ()=>generateAccessToken,
    "isTokenBlacklisted",
    ()=>isTokenBlacklisted,
    "verifyAccessToken",
    ()=>verifyAccessToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config/config.ts [middleware] (ecmascript)");
;
;
;
// In-memory store for blacklisted tokens (replace with Redis/DB in production)
const blacklistedTokens = new Set();
function generateAccessToken(user, sessionId) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["VALID_ROLES"].includes(user.role)) {
        throw new Error("Invalid user role");
    }
    const jti = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomUUID();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        type: "access",
        jti,
        sid: sessionId
    }, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["authConfig"].JWT_SECRET, {
        expiresIn: "15m"
    });
}
function blacklistToken(token) {
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].decode(token);
        if (decoded?.jti) {
            blacklistedTokens.add(decoded.jti);
        } else {
            // Fallback for tokens without jti (legacy)
            blacklistedTokens.add(token);
        }
    } catch (error) {
        console.error("[Auth] Failed to blacklist token:", error);
    }
}
function isTokenBlacklisted(token) {
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].decode(token);
        if (decoded?.jti && blacklistedTokens.has(decoded.jti)) {
            return true;
        }
        return blacklistedTokens.has(token);
    } catch  {
        return true // Fail safe
        ;
    }
}
function verifyAccessToken(token) {
    try {
        if (isTokenBlacklisted(token)) {
            return null;
        }
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["default"].verify(token, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["authConfig"].JWT_SECRET);
        if (decoded.type !== "access" || !__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2f$config$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["VALID_ROLES"].includes(decoded.role)) {
            return null;
        }
        return {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
        };
    } catch (error) {
        return null;
    }
}
}),
"[project]/lib/auth/auth.ts [middleware] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createUser",
    ()=>createUser,
    "extractTokenFromRequest",
    ()=>extractTokenFromRequest,
    "findUserByEmail",
    ()=>findUserByEmail,
    "findUserById",
    ()=>findUserById,
    "findUserByUsername",
    ()=>findUserByUsername,
    "getAllUsers",
    ()=>getAllUsers,
    "hasPermission",
    ()=>hasPermission,
    "validatePasswordPolicy",
    ()=>validatePasswordPolicy,
    "validateUserData",
    ()=>validateUserData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/token-service.ts [middleware] (ecmascript)");
const validatePasswordPolicy = (password)=>{
    const errors = [];
    if (password.length < 12) {
        errors.push("Password must be at least 12 characters long");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must contain at least one special character");
    }
    // Check for common patterns
    if (/(.)\\1{2,}/.test(password)) {
        errors.push("Password cannot contain repeated characters");
    }
    if (/123|abc|qwe|password|admin/i.test(password)) {
        errors.push("Password cannot contain common patterns");
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
const validateUserData = (userData)=>{
    const errors = [];
    const validRoles = [
        "admin",
        "vet",
        "assistant"
    ];
    if (userData.username && userData.username.length < 5) {
        errors.push("El nombre de usuario debe tener al menos 5 caracteres.");
    }
    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        errors.push("Formato de correo electrónico no válido");
    }
    if (userData.password) {
        const passwordValidation = validatePasswordPolicy(userData.password);
        if (!passwordValidation.isValid) {
            errors.push(...passwordValidation.errors);
        }
    }
    if (userData.role && !validRoles.includes(userData.role)) {
        errors.push(`Rol no válido. Debe ser uno de los siguientes: ${validRoles.join(", ")}`);
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
function extractTokenFromRequest(request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    return authHeader.substring(7) // Remove 'Bearer ' prefix
    ;
}
function hasPermission(userRole, requiredPermission) {
    const rolePermissions = {
        admin: [
            "manage_users",
            "manage_medical_records",
            "manage_appointments",
            "manage_pets",
            "manage_owners",
            "manage_invoices",
            "access_admin_panel",
            "manage_system_settings",
            "view_reports",
            "manage_reports"
        ],
        vet: [
            "manage_medical_records",
            "manage_appointments",
            "manage_pets",
            "manage_owners",
            "manage_invoices",
            "view_reports"
        ],
        assistant: [
            "view_medical_records",
            "manage_appointments",
            "manage_pets",
            "manage_owners",
            "create_invoices",
            "view_invoices"
        ]
    };
    return rolePermissions[userRole]?.includes(requiredPermission) || false;
}
async function getAllUsers() {
    return await getAllUsers();
}
async function findUserById(id) {
    const users = await getAllUsers();
    return users.find((user)=>user.id === id) || null;
}
async function createUser(userData) {
    const { hashPassword } = await __turbopack_context__.A("[project]/lib/auth/password-service.ts [middleware] (ecmascript, async loader)");
    const passwordHash = await hashPassword(userData.password);
    // Map role name to roleId (this is a simplified mock mapping)
    const roleIdMap = {
        admin: 1,
        vet: 2,
        assistant: 3
    };
    // In a real app, this would save to database
    const now = new Date().toISOString();
    const newUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        passwordHash: passwordHash,
        roleId: roleIdMap[userData.role],
        statusId: 1,
        veterinarianId: null,
        lastLogin: null,
        lastLoginIp: null,
        currentSessionId: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
        passwordChangedAt: now,
        passwordExpiresAt: null,
        mustChangePassword: false,
        passwordHistory: null,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: null,
        twoFactorVerifiedAt: null,
        sessionTimeoutMinutes: 30,
        timezone: "America/Bogota",
        preferredLanguage: "es",
        emailNotifications: true,
        smsNotifications: false,
        notificationPreferences: null,
        isEmailVerified: false,
        emailVerificationToken: null,
        emailVerifiedAt: null,
        apiAccessEnabled: false,
        apiKeyHash: null,
        apiLastUsed: null,
        createdAt: now,
        updatedAt: now
    };
    return newUser;
}
async function findUserByEmail(email) {
    const users = await getAllUsers();
    return users.find((user)=>user.email === email) || null;
}
async function findUserByUsername(username) {
    const users = await getAllUsers();
    return users.find((user)=>user.username === username) || null;
}
;
}),
"[project]/lib/auth/permissions.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkResourcePermission",
    ()=>checkResourcePermission,
    "permissions",
    ()=>permissions
]);
// Función genérica para crear verificadores de permisos
const createPermissionChecker = (allowedRoles)=>(role)=>allowedRoles.includes(role);
const permissions = {
    // Permisos administrativos
    canManageUsers: createPermissionChecker([
        'admin'
    ]),
    canManageAllData: createPermissionChecker([
        'admin'
    ]),
    canAccessAdminPanel: createPermissionChecker([
        'admin'
    ]),
    // Permisos de veterinario
    canManageMedicalRecords: createPermissionChecker([
        'admin',
        'vet'
    ]),
    canViewAllRecords: createPermissionChecker([
        'admin',
        'vet'
    ]),
    canPrescribeMedication: createPermissionChecker([
        'admin',
        'vet'
    ]),
    canPerformSurgery: createPermissionChecker([
        'admin',
        'vet'
    ]),
    // Permisos de asistente
    canManageBasicData: createPermissionChecker([
        'admin',
        'vet',
        'assistant'
    ]),
    canCreateAppointments: createPermissionChecker([
        'admin',
        'vet',
        'assistant'
    ]),
    canViewBasicInfo: createPermissionChecker([
        'admin',
        'vet',
        'assistant'
    ]),
    canUpdatePetInfo: createPermissionChecker([
        'admin',
        'vet',
        'assistant'
    ]),
    // Permisos generales
    canRead: createPermissionChecker([
        'admin',
        'vet',
        'assistant'
    ]),
    canWrite: createPermissionChecker([
        'admin',
        'vet',
        'assistant'
    ]),
    canDelete: createPermissionChecker([
        'admin',
        'vet'
    ]),
    // Permisos específicos por recurso
    canViewMedicalRecords: (role, isOwner = false)=>{
        return permissions.canManageMedicalRecords(role) || role === 'assistant' && isOwner;
    },
    canEditInvoices: createPermissionChecker([
        'admin',
        'vet'
    ]),
    canViewReports: createPermissionChecker([
        'admin',
        'vet'
    ])
};
const checkResourcePermission = (userRole, action, // eslint-disable-next-line @typescript-eslint/no-explicit-any
additionalContext)=>{
    const permissionCheck = permissions[action];
    if (typeof permissionCheck === 'function') {
        return permissionCheck(userRole, additionalContext);
    }
    return false;
};
}),
"[project]/lib/auth/index.ts [middleware] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/auth/auth.ts [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$permissions$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/permissions.ts [middleware] (ecmascript)");
;
;
}),
"[project]/lib/auth/auth.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createUser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createUser"],
    "extractTokenFromRequest",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["extractTokenFromRequest"],
    "findUserByEmail",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["findUserByEmail"],
    "findUserById",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["findUserById"],
    "findUserByUsername",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["findUserByUsername"],
    "generateToken",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["generateAccessToken"],
    "getAllUsers",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getAllUsers"],
    "hasPermission",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hasPermission"],
    "validatePasswordPolicy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["validatePasswordPolicy"],
    "validateUserData",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__["validateUserData"],
    "verifyToken",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verifyAccessToken"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/auth/auth.ts [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$token$2d$service$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/token-service.ts [middleware] (ecmascript)");
}),
"[project]/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$index$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/auth/index.ts [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/auth.ts [middleware] (ecmascript)");
;
;
const protectedRoutes = {
    "/dashboard": {
        roles: [
            "admin",
            "vet",
            "assistant"
        ]
    },
    "/dashboard/admin": {
        roles: [
            "admin"
        ]
    },
    "/dashboard/medical": {
        roles: [
            "admin",
            "vet"
        ]
    },
    "/dashboard/appointments": {
        roles: [
            "admin",
            "vet",
            "assistant"
        ]
    },
    "/dashboard/tasks": {
        roles: [
            "admin",
            "vet",
            "assistant"
        ]
    },
    "/users": {
        roles: [
            "admin"
        ]
    },
    "/medical-records": {
        roles: [
            "admin",
            "vet"
        ]
    },
    "/appointments": {
        roles: [
            "admin",
            "vet",
            "assistant"
        ]
    },
    "/pets": {
        roles: [
            "admin",
            "vet",
            "assistant"
        ]
    },
    "/owners": {
        roles: [
            "admin",
            "vet",
            "assistant"
        ]
    },
    "/invoices": {
        roles: [
            "admin",
            "vet"
        ]
    },
    "/api/users": {
        roles: [
            "admin"
        ]
    },
    "/api/medical-records": {
        roles: [
            "admin",
            "vet"
        ]
    },
    "/api/appointments": {
        roles: [
            "admin",
            "vet",
            "assistant"
        ]
    },
    "/api/pets": {
        roles: [
            "admin",
            "vet",
            "assistant"
        ]
    },
    "/api/owners": {
        roles: [
            "admin",
            "vet",
            "assistant"
        ]
    },
    "/api/invoices": {
        roles: [
            "admin",
            "vet"
        ]
    }
};
const getDashboardRedirect = (role)=>{
    switch(role){
        case "admin":
            return "/dashboard/admin";
        case "vet":
            return "/dashboard/medical";
        case "assistant":
            return "/dashboard/appointments";
        default:
            return "/dashboard";
    }
};
async function middleware(request) {
    const { pathname } = request.nextUrl;
    // Skip middleware for public routes
    if (pathname.startsWith("/_next") || pathname.startsWith("/api/auth/login") || pathname.startsWith("/api/auth/refresh") || pathname.startsWith("/login") || pathname === "/favicon.ico" || pathname.startsWith("/public")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["extractTokenFromRequest"])(request) || request.cookies.get("auth-token")?.value;
    if (!token) {
        // Redirect to login if no token
        if (pathname.startsWith("/api/")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Authentication required"
            }, {
                status: 401
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", request.url));
    }
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$auth$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["verifyToken"])(token);
    if (!user) {
        // Invalid token - redirect to login
        if (pathname.startsWith("/api/")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid or expired token"
            }, {
                status: 401
            });
        }
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", request.url));
        response.cookies.delete("auth-token");
        return response;
    }
    if (pathname === "/" || pathname === "/dashboard") {
        const dashboardUrl = getDashboardRedirect(user.role);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(dashboardUrl, request.url));
    }
    const routeConfig = Object.entries(protectedRoutes).find(([route])=>pathname.startsWith(route))?.[1];
    if (routeConfig && !routeConfig.roles.includes(user.role)) {
        if (pathname.startsWith("/api/")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Insufficient permissions",
                required: routeConfig.roles,
                current: user.role
            }, {
                status: 403
            });
        }
        // Redirect to appropriate dashboard for unauthorized access
        const dashboardUrl = getDashboardRedirect(user.role);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(dashboardUrl, request.url));
    }
    if (pathname.startsWith("/api/")) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", user.id.toString());
        requestHeaders.set("x-user-role", user.role);
        requestHeaders.set("x-user-email", user.email);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
            request: {
                headers: requestHeaders
            }
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */ "/((?!_next/static|_next/image|favicon.ico|public/).*)"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d90b5439._.js.map