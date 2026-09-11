"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var admin_controller_1 = require("../controllers/admin.controller");
var adminRouter = express_1.default.Router();
adminRouter.route('/sviKorisnici').get(function (req, res) { return new admin_controller_1.AdminController().sviKorisnici(req, res); });
adminRouter.route('/odobriKorisnika').post(function (req, res) { return new admin_controller_1.AdminController().odobriKorisnika(req, res); });
adminRouter.route('/deaktivirajKorisnika').post(function (req, res) { return new admin_controller_1.AdminController().deaktivirajKorisnika(req, res); });
adminRouter.route('/obrisiKorisnika').post(function (req, res) { return new admin_controller_1.AdminController().obrisiKorisnika(req, res); });
adminRouter.route('/azurirajKorisnika').post(function (req, res) { return new admin_controller_1.AdminController().azurirajKorisnika(req, res); });
adminRouter.route('/statistika').get(function (req, res) { return new admin_controller_1.AdminController().statistika(req, res); });
adminRouter.route('/prometPoStamparijama').get(function (req, res) { return new admin_controller_1.AdminController().prometPoStamparijama(req, res); });
adminRouter.route('/najtrazenijiProizvodiMesec').get(function (req, res) { return new admin_controller_1.AdminController().najtrazenijiProizvodiMesec(req, res); });
adminRouter.route('/ocenaProizvodaKrozVreme').get(function (req, res) { return new admin_controller_1.AdminController().ocenaProizvodaKrozVreme(req, res); });
exports.default = adminRouter;
