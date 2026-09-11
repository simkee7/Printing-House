"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var nabavka_controller_1 = require("../controllers/nabavka.controller");
var nabavkaRouter = express_1.default.Router();
nabavkaRouter.route('/kreirajIzKorpe').post(function (req, res) { return new nabavka_controller_1.NabavkaController().kreirajIzKorpe(req, res); });
nabavkaRouter.route('/moje').post(function (req, res) { return new nabavka_controller_1.NabavkaController().moje(req, res); });
nabavkaRouter.route('/otvorene').get(function (req, res) { return new nabavka_controller_1.NabavkaController().otvorene(req, res); });
nabavkaRouter.route('/mojePonude').post(function (req, res) { return new nabavka_controller_1.NabavkaController().mojePonude(req, res); });
nabavkaRouter.route('/posaljiPonudu').post(function (req, res) { return new nabavka_controller_1.NabavkaController().posaljiPonudu(req, res); });
nabavkaRouter.route('/izvestaj/:id').get(function (req, res) { return new nabavka_controller_1.NabavkaController().izvestaj(req, res); });
nabavkaRouter.route('/:id').get(function (req, res) { return new nabavka_controller_1.NabavkaController().detalji(req, res); });
exports.default = nabavkaRouter;
