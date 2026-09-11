"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var narudzbina_controller_1 = require("../controllers/narudzbina.controller");
var narudzbinaRouter = express_1.default.Router();
narudzbinaRouter.route('/moje').post(function (req, res) { return new narudzbina_controller_1.NarudzbinaController().mojeNarudzbine(req, res); });
narudzbinaRouter.route('/otkazi').post(function (req, res) { return new narudzbina_controller_1.NarudzbinaController().otkazi(req, res); });
narudzbinaRouter.route('/kreiraj').post(function (req, res) { return new narudzbina_controller_1.NarudzbinaController().kreiraj(req, res); });
narudzbinaRouter.route('/faktura/:id').get(function (req, res) { return new narudzbina_controller_1.NarudzbinaController().faktura(req, res); });
narudzbinaRouter.route('/arhiva').post(function (req, res) { return new narudzbina_controller_1.NarudzbinaController().arhiva(req, res); });
narudzbinaRouter.route('/potvrdiPrijem').post(function (req, res) { return new narudzbina_controller_1.NarudzbinaController().potvrdiPrijem(req, res); });
narudzbinaRouter.route('/zaStampariju').post(function (req, res) { return new narudzbina_controller_1.NarudzbinaController().zaStampariju(req, res); });
narudzbinaRouter.route('/sledeciKorak').post(function (req, res) { return new narudzbina_controller_1.NarudzbinaController().sledeciKorak(req, res); });
narudzbinaRouter.route('/izvestaj').post(function (req, res) { return new narudzbina_controller_1.NarudzbinaController().izvestaj(req, res); });
exports.default = narudzbinaRouter;
