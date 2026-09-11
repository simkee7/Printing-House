"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var kategorija_controller_1 = require("../controllers/kategorija.controller");
var kategorijaRouter = express_1.default.Router();
kategorijaRouter.route('/sve').get(function (req, res) { return new kategorija_controller_1.KategorijaController().sve(req, res); });
kategorijaRouter.route('/dodaj').post(function (req, res) { return new kategorija_controller_1.KategorijaController().dodaj(req, res); });
kategorijaRouter.route('/izmeni').post(function (req, res) { return new kategorija_controller_1.KategorijaController().izmeni(req, res); });
kategorijaRouter.route('/obrisi').post(function (req, res) { return new kategorija_controller_1.KategorijaController().obrisi(req, res); });
exports.default = kategorijaRouter;
