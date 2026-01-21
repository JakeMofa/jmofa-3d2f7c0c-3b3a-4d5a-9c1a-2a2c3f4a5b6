/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(5);
const typeorm_1 = __webpack_require__(6);
const app_controller_1 = __webpack_require__(7);
const app_service_1 = __webpack_require__(8);
const auth_module_1 = __webpack_require__(9);
const users_module_1 = __webpack_require__(23);
const orgs_module_1 = __webpack_require__(24);
const tasks_module_1 = __webpack_require__(26);
const audit_module_1 = __webpack_require__(41);
const organization_entity_1 = __webpack_require__(18);
const user_entity_1 = __webpack_require__(17);
const task_entity_1 = __webpack_require__(27);
const audit_log_entity_1 = __webpack_require__(37);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'sqlite',
                    database: configService.get('DB_PATH') || './dev.sqlite',
                    entities: [organization_entity_1.Organization, user_entity_1.User, task_entity_1.Task, audit_log_entity_1.AuditLog],
                    synchronize: true, // Auto-create tables (dev only)
                    logging: false,
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            orgs_module_1.OrgsModule,
            tasks_module_1.TasksModule,
            audit_module_1.AuditModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/typeorm");

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(8);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let AppService = class AppService {
    getData() {
        return { message: 'Hello API' };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(10);
const passport_1 = __webpack_require__(11);
const config_1 = __webpack_require__(5);
const auth_controller_1 = __webpack_require__(12);
const auth_service_1 = __webpack_require__(13);
const jwt_strategy_1 = __webpack_require__(21);
const users_module_1 = __webpack_require__(23);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'super-dev-secret',
                    signOptions: {
                        expiresIn: (configService.get('JWT_EXPIRES_IN') || '3600s'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(11);
const auth_service_1 = __webpack_require__(13);
const login_dto_1 = __webpack_require__(19);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async getProfile(req) {
        return req.user;
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, common_1.Post)('login'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(10);
const bcrypt = tslib_1.__importStar(__webpack_require__(14));
const users_service_1 = __webpack_require__(15);
let AuthService = class AuthService {
    constructor(jwtService, usersService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            email: user.email,
            sub: user.id,
            orgId: user.orgId,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                orgId: user.orgId,
            },
        };
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async validateToken(payload) {
        return {
            id: payload.sub,
            email: payload.email,
            orgId: payload.orgId,
            role: payload.role,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(16);
const user_entity_1 = __webpack_require__(17);
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findById(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
    async create(userData) {
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], UsersService);


/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = exports.UserRole = void 0;
const tslib_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(16);
const organization_entity_1 = __webpack_require__(18);
var UserRole;
(function (UserRole) {
    UserRole["OWNER"] = "owner";
    UserRole["ADMIN"] = "admin";
    UserRole["VIEWER"] = "viewer";
})(UserRole || (exports.UserRole = UserRole = {}));
let User = class User {
};
exports.User = User;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], User.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        enum: UserRole,
        default: UserRole.VIEWER,
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "role", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "orgId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization),
    tslib_1.__metadata("design:type", typeof (_a = typeof organization_entity_1.Organization !== "undefined" && organization_entity_1.Organization) === "function" ? _a : Object)
], User.prototype, "organization", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], User.prototype, "updatedAt", void 0);
exports.User = User = tslib_1.__decorate([
    (0, typeorm_1.Entity)('users')
], User);


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Organization = void 0;
const tslib_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(16);
let Organization = class Organization {
};
exports.Organization = Organization;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "parentOrgId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => Organization, { nullable: true }),
    tslib_1.__metadata("design:type", Organization)
], Organization.prototype, "parentOrg", void 0);
tslib_1.__decorate([
    (0, typeorm_1.OneToMany)(() => Organization, (org) => org.parentOrg),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "childOrgs", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Organization.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Organization.prototype, "updatedAt", void 0);
exports.Organization = Organization = tslib_1.__decorate([
    (0, typeorm_1.Entity)('organizations')
], Organization);


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(20);
class LoginDto {
}
exports.LoginDto = LoginDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(11);
const passport_jwt_1 = __webpack_require__(22);
const config_1 = __webpack_require__(5);
const auth_service_1 = __webpack_require__(13);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(authService, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'super-dev-secret',
        });
        this.authService = authService;
        this.configService = configService;
    }
    async validate(payload) {
        return this.authService.validateToken(payload);
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(6);
const user_entity_1 = __webpack_require__(17);
const users_service_1 = __webpack_require__(15);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrgsModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(6);
const organization_entity_1 = __webpack_require__(18);
const orgs_service_1 = __webpack_require__(25);
let OrgsModule = class OrgsModule {
};
exports.OrgsModule = OrgsModule;
exports.OrgsModule = OrgsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([organization_entity_1.Organization])],
        providers: [orgs_service_1.OrgsService],
        exports: [orgs_service_1.OrgsService],
    })
], OrgsModule);


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrgsService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(16);
const organization_entity_1 = __webpack_require__(18);
let OrgsService = class OrgsService {
    constructor(orgsRepository) {
        this.orgsRepository = orgsRepository;
    }
    async findById(id) {
        return this.orgsRepository.findOne({ where: { id } });
    }
    async getChildOrgIds(orgId) {
        const children = await this.orgsRepository.find({
            where: { parentOrgId: orgId },
        });
        return children.map((org) => org.id);
    }
    async create(orgData) {
        const org = this.orgsRepository.create(orgData);
        return this.orgsRepository.save(org);
    }
};
exports.OrgsService = OrgsService;
exports.OrgsService = OrgsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], OrgsService);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(6);
const task_entity_1 = __webpack_require__(27);
const tasks_service_1 = __webpack_require__(28);
const tasks_controller_1 = __webpack_require__(38);
const auth_1 = __webpack_require__(29);
const orgs_module_1 = __webpack_require__(24);
const audit_module_1 = __webpack_require__(41);
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([task_entity_1.Task]), orgs_module_1.OrgsModule, audit_module_1.AuditModule],
        controllers: [tasks_controller_1.TasksController],
        providers: [tasks_service_1.TasksService, auth_1.AccessControlService],
    })
], TasksModule);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Task = exports.TaskStatus = void 0;
const tslib_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(16);
const user_entity_1 = __webpack_require__(17);
const organization_entity_1 = __webpack_require__(18);
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["DONE"] = "done";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
let Task = class Task {
};
exports.Task = Task;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: 'general' }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "category", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        enum: TaskStatus,
        default: TaskStatus.TODO,
    }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Task.prototype, "orderIndex", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "orgId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization),
    tslib_1.__metadata("design:type", typeof (_a = typeof organization_entity_1.Organization !== "undefined" && organization_entity_1.Organization) === "function" ? _a : Object)
], Task.prototype, "organization", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "ownerUserId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    tslib_1.__metadata("design:type", typeof (_b = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _b : Object)
], Task.prototype, "owner", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Task.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Task.prototype, "updatedAt", void 0);
exports.Task = Task = tslib_1.__decorate([
    (0, typeorm_1.Entity)('tasks')
], Task);


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(16);
const task_entity_1 = __webpack_require__(27);
const auth_1 = __webpack_require__(29);
const orgs_service_1 = __webpack_require__(25);
const audit_service_1 = __webpack_require__(36);
let TasksService = class TasksService {
    constructor(tasksRepository, accessControlService, orgsService, auditService) {
        this.tasksRepository = tasksRepository;
        this.accessControlService = accessControlService;
        this.orgsService = orgsService;
        this.auditService = auditService;
    }
    async create(user, createTaskDto) {
        // User can only create tasks in their own org
        const task = this.tasksRepository.create({
            ...createTaskDto,
            orgId: user.orgId,
            ownerUserId: user.id,
        });
        const savedTask = await this.tasksRepository.save(task);
        await this.auditService.log({
            userId: user.id,
            action: 'task:create',
            resourceType: 'task',
            resourceId: savedTask.id,
            allowed: true,
        });
        return savedTask;
    }
    async findAll(user) {
        // Get child org IDs for org scoping
        const childOrgIds = await this.orgsService.getChildOrgIds(user.orgId);
        const accessibleOrgIds = this.accessControlService.getAccessibleOrgIds(user, childOrgIds);
        const tasks = await this.tasksRepository.find({
            where: { orgId: (0, typeorm_2.In)(accessibleOrgIds) },
            order: { orderIndex: 'ASC', createdAt: 'DESC' },
        });
        await this.auditService.log({
            userId: user.id,
            action: 'task:read',
            resourceType: 'task',
            allowed: true,
        });
        return tasks;
    }
    async findOne(user, id) {
        const task = await this.tasksRepository.findOne({ where: { id } });
        if (!task) {
            await this.auditService.log({
                userId: user.id,
                action: 'task:read',
                resourceType: 'task',
                resourceId: id,
                allowed: false,
                reason: 'Task not found',
            });
            throw new common_1.NotFoundException('Task not found');
        }
        // Check if user can access this task's org
        const childOrgIds = await this.orgsService.getChildOrgIds(user.orgId);
        const canAccess = this.accessControlService.canAccessOrg(user, task.orgId, childOrgIds);
        if (!canAccess) {
            await this.auditService.log({
                userId: user.id,
                action: 'task:read',
                resourceType: 'task',
                resourceId: id,
                allowed: false,
                reason: 'Org access denied',
            });
            throw new common_1.ForbiddenException('Cannot access this task');
        }
        await this.auditService.log({
            userId: user.id,
            action: 'task:read',
            resourceType: 'task',
            resourceId: id,
            allowed: true,
        });
        return task;
    }
    async update(user, id, updateTaskDto) {
        const task = await this.findOne(user, id);
        // User can update if they have update permission and can access the org
        Object.assign(task, updateTaskDto);
        const updatedTask = await this.tasksRepository.save(task);
        await this.auditService.log({
            userId: user.id,
            action: 'task:update',
            resourceType: 'task',
            resourceId: id,
            allowed: true,
        });
        return updatedTask;
    }
    async remove(user, id) {
        const task = await this.findOne(user, id);
        await this.tasksRepository.remove(task);
        await this.auditService.log({
            userId: user.id,
            action: 'task:delete',
            resourceType: 'task',
            resourceId: id,
            allowed: true,
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof auth_1.AccessControlService !== "undefined" && auth_1.AccessControlService) === "function" ? _b : Object, typeof (_c = typeof orgs_service_1.OrgsService !== "undefined" && orgs_service_1.OrgsService) === "function" ? _c : Object, typeof (_d = typeof audit_service_1.AuditService !== "undefined" && audit_service_1.AuditService) === "function" ? _d : Object])
], TasksService);


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(4);
tslib_1.__exportStar(__webpack_require__(30), exports);
tslib_1.__exportStar(__webpack_require__(31), exports);
tslib_1.__exportStar(__webpack_require__(32), exports);
tslib_1.__exportStar(__webpack_require__(33), exports);
tslib_1.__exportStar(__webpack_require__(34), exports);
tslib_1.__exportStar(__webpack_require__(35), exports);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.auth = auth;
function auth() {
    return 'auth';
}


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Role = void 0;
var Role;
(function (Role) {
    Role["OWNER"] = "owner";
    Role["ADMIN"] = "admin";
    Role["VIEWER"] = "viewer";
})(Role || (exports.Role = Role = {}));


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ROLE_PERMISSIONS = void 0;
exports.hasPermission = hasPermission;
const roles_1 = __webpack_require__(31);
// Define what each role can do
exports.ROLE_PERMISSIONS = {
    [roles_1.Role.VIEWER]: [
        'task:read',
    ],
    [roles_1.Role.ADMIN]: [
        'task:create',
        'task:read',
        'task:update',
        'task:delete',
        'audit-log:read',
    ],
    [roles_1.Role.OWNER]: [
        'task:create',
        'task:read',
        'task:update',
        'task:delete',
        'audit-log:read',
    ],
};
function hasPermission(role, permission) {
    return exports.ROLE_PERMISSIONS[role]?.includes(permission) || false;
}


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequirePermissions = exports.PERMISSIONS_KEY = void 0;
const common_1 = __webpack_require__(1);
exports.PERMISSIONS_KEY = 'permissions';
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.RequirePermissions = RequirePermissions;


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RbacGuard = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const require_permissions_decorator_1 = __webpack_require__(33);
const permissions_1 = __webpack_require__(32);
let RbacGuard = class RbacGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(require_permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions) {
            return true; // No permissions required
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user || !user.role) {
            throw new common_1.ForbiddenException('User not authenticated');
        }
        const userRole = user.role;
        // Check if user has ALL required permissions
        const hasAllPermissions = requiredPermissions.every((permission) => (0, permissions_1.hasPermission)(userRole, permission));
        if (!hasAllPermissions) {
            throw new common_1.ForbiddenException(`Insufficient permissions. Required: ${requiredPermissions.join(', ')}`);
        }
        return true;
    }
};
exports.RbacGuard = RbacGuard;
exports.RbacGuard = RbacGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RbacGuard);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccessControlService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const roles_1 = __webpack_require__(31);
let AccessControlService = class AccessControlService {
    /**
     * Get list of organization IDs that a user can access
     * - Viewer: only their own org
     * - Admin: their org + child orgs
     * - Owner: their org + child orgs
     */
    getAccessibleOrgIds(user, childOrgIds = []) {
        if (user.role === roles_1.Role.VIEWER) {
            return [user.orgId];
        }
        // Admin and Owner can access their org and child orgs
        return [user.orgId, ...childOrgIds];
    }
    /**
     * Check if user can access a specific org
     */
    canAccessOrg(user, targetOrgId, childOrgIds = []) {
        const accessibleOrgs = this.getAccessibleOrgIds(user, childOrgIds);
        return accessibleOrgs.includes(targetOrgId);
    }
    /**
     * Check if user owns a resource (created by them)
     */
    isResourceOwner(user, resourceOwnerId) {
        return user.id === resourceOwnerId;
    }
};
exports.AccessControlService = AccessControlService;
exports.AccessControlService = AccessControlService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AccessControlService);


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(6);
const typeorm_2 = __webpack_require__(16);
const audit_log_entity_1 = __webpack_require__(37);
let AuditService = class AuditService {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }
    async log(logData) {
        const log = this.auditRepository.create(logData);
        await this.auditRepository.save(log);
    }
    async findAll() {
        return this.auditRepository.find({ order: { timestamp: 'DESC' } });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], AuditService);


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditLog = void 0;
const tslib_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(16);
let AuditLog = class AuditLog {
};
exports.AuditLog = AuditLog;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "resourceType", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "resourceId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Boolean)
], AuditLog.prototype, "allowed", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], AuditLog.prototype, "reason", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], AuditLog.prototype, "timestamp", void 0);
exports.AuditLog = AuditLog = tslib_1.__decorate([
    (0, typeorm_1.Entity)('audit_logs')
], AuditLog);


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(11);
const auth_1 = __webpack_require__(29);
const tasks_service_1 = __webpack_require__(28);
const create_task_dto_1 = __webpack_require__(39);
const update_task_dto_1 = __webpack_require__(40);
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async create(req, createTaskDto) {
        return this.tasksService.create(req.user, createTaskDto);
    }
    async findAll(req) {
        return this.tasksService.findAll(req.user);
    }
    async findOne(req, id) {
        return this.tasksService.findOne(req.user, id);
    }
    async update(req, id, updateTaskDto) {
        return this.tasksService.update(req.user, id, updateTaskDto);
    }
    async remove(req, id) {
        await this.tasksService.remove(req.user, id);
        return { message: 'Task deleted successfully' };
    }
};
exports.TasksController = TasksController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, auth_1.RequirePermissions)('task:create'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, typeof (_b = typeof create_task_dto_1.CreateTaskDto !== "undefined" && create_task_dto_1.CreateTaskDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, auth_1.RequirePermissions)('task:read'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_1.RequirePermissions)('task:read'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, auth_1.RequirePermissions)('task:update'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, typeof (_c = typeof update_task_dto_1.UpdateTaskDto !== "undefined" && update_task_dto_1.UpdateTaskDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_1.RequirePermissions)('task:delete'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = tslib_1.__decorate([
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), auth_1.RbacGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof tasks_service_1.TasksService !== "undefined" && tasks_service_1.TasksService) === "function" ? _a : Object])
], TasksController);


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTaskDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(20);
const task_entity_1 = __webpack_require__(27);
class CreateTaskDto {
}
exports.CreateTaskDto = CreateTaskDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateTaskDto.prototype, "category", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_entity_1.TaskStatus),
    tslib_1.__metadata("design:type", typeof (_a = typeof task_entity_1.TaskStatus !== "undefined" && task_entity_1.TaskStatus) === "function" ? _a : Object)
], CreateTaskDto.prototype, "status", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], CreateTaskDto.prototype, "orderIndex", void 0);


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTaskDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(20);
const task_entity_1 = __webpack_require__(27);
class UpdateTaskDto {
}
exports.UpdateTaskDto = UpdateTaskDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTaskDto.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTaskDto.prototype, "description", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTaskDto.prototype, "category", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(task_entity_1.TaskStatus),
    tslib_1.__metadata("design:type", typeof (_a = typeof task_entity_1.TaskStatus !== "undefined" && task_entity_1.TaskStatus) === "function" ? _a : Object)
], UpdateTaskDto.prototype, "status", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], UpdateTaskDto.prototype, "orderIndex", void 0);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const typeorm_1 = __webpack_require__(6);
const audit_log_entity_1 = __webpack_require__(37);
const audit_service_1 = __webpack_require__(36);
const audit_controller_1 = __webpack_require__(42);
let AuditModule = class AuditModule {
};
exports.AuditModule = AuditModule;
exports.AuditModule = AuditModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([audit_log_entity_1.AuditLog])],
        controllers: [audit_controller_1.AuditController],
        providers: [audit_service_1.AuditService],
        exports: [audit_service_1.AuditService],
    })
], AuditModule);


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(11);
const auth_1 = __webpack_require__(29);
const audit_service_1 = __webpack_require__(36);
let AuditController = class AuditController {
    constructor(auditService) {
        this.auditService = auditService;
    }
    async findAll(req) {
        return this.auditService.findAll();
    }
};
exports.AuditController = AuditController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, auth_1.RequirePermissions)('audit-log:read'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuditController.prototype, "findAll", null);
exports.AuditController = AuditController = tslib_1.__decorate([
    (0, common_1.Controller)('audit-log'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), auth_1.RbacGuard),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof audit_service_1.AuditService !== "undefined" && audit_service_1.AuditService) === "function" ? _a : Object])
], AuditController);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS for frontend
    app.enableCors();
    // Enable validation globally
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map