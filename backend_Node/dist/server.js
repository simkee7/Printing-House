"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importStar(require("express"));
var cors_1 = __importDefault(require("cors"));
var mongoose_1 = __importDefault(require("mongoose"));
var user_routes_1 = __importDefault(require("./routes/user.routes"));
var proizvod_routes_1 = __importDefault(require("./routes/proizvod.routes"));
var narudzbina_routes_1 = __importDefault(require("./routes/narudzbina.routes"));
var nabavka_routes_1 = __importDefault(require("./routes/nabavka.routes"));
var admin_routes_1 = __importDefault(require("./routes/admin.routes"));
var kategorija_routes_1 = __importDefault(require("./routes/kategorija.routes"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '15mb' }));
mongoose_1.default.connect("mongodb://127.0.0.1:27017/projekat2026");
var connection = mongoose_1.default.connection;
connection.once('open', function () {
    console.log("db connection ok");
});
var router = (0, express_1.Router)();
router.use('/user', user_routes_1.default);
router.use('/proizvod', proizvod_routes_1.default);
router.use('/narudzbina', narudzbina_routes_1.default);
router.use('/nabavka', nabavka_routes_1.default);
router.use('/admin', admin_routes_1.default);
router.use('/kategorija', kategorija_routes_1.default);
app.use('/', router);
app.use('/uploads/profile_pics', express_1.default.static('uploads/profile_pics'));
app.use('/uploads/proizvodi', express_1.default.static('uploads/proizvodi'));
app.listen(4000, function () { return console.log("Express server running on port 4000"); });
