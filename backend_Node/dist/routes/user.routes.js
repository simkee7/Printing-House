"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_controller_1 = require("../controllers/user.controller");
var userRouter = express_1.default.Router();
userRouter.route('/login').post(function (req, res) { return new user_controller_1.UserController().login(req, res); });
userRouter.route('/getUser').post(function (req, res) { return new user_controller_1.UserController().getUser(req, res); });
userRouter.route('/register').post(function (req, res) { return new user_controller_1.UserController().register(req, res); });
userRouter.route('/promeniLozinku').post(function (req, res) { return new user_controller_1.UserController().promeniLozinku(req, res); });
userRouter.route('/zaboravljenaLozinka').post(function (req, res) { return new user_controller_1.UserController().zaboravljenaLozinka(req, res); });
userRouter.route('/resetujLozinku').post(function (req, res) { return new user_controller_1.UserController().resetujLozinku(req, res); });
userRouter.route('/azurirajProfil').post(function (req, res) { return new user_controller_1.UserController().azurirajProfil(req, res); });
userRouter.route('/getStamparija').post(function (req, res) { return new user_controller_1.UserController().getStamparija(req, res); });
exports.default = userRouter;
