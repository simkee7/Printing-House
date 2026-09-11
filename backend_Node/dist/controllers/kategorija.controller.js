"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KategorijaController = void 0;
var kategorija_1 = __importDefault(require("../models/kategorija"));
var KategorijaController = /** @class */ (function () {
    function KategorijaController() {
        this.sve = function (req, res) {
            kategorija_1.default.find({}).sort({ naziv: 1 }).then(function (kategorije) {
                res.json(kategorije);
            }).catch(function (err) {
                console.log(err);
                res.json([]);
            });
        };
        this.dodaj = function (req, res) {
            var naziv = req.body.naziv;
            var potkategorije = req.body.potkategorije || [];
            new kategorija_1.default({ naziv: naziv, potkategorije: potkategorije }).save().then(function (sacuvana) {
                res.json({ msg: 'Kategorija je dodata.', kategorija: sacuvana });
            }).catch(function (err) {
                console.log(err);
                if (err.code === 11000) {
                    res.json({ msg: 'Kategorija sa tim nazivom vec postoji.' });
                    return;
                }
                res.json({ msg: 'Greska pri dodavanju kategorije!' });
            });
        };
        this.izmeni = function (req, res) {
            var id = req.body._id;
            var naziv = req.body.naziv;
            var potkategorije = req.body.potkategorije || [];
            kategorija_1.default.findByIdAndUpdate(id, { naziv: naziv, potkategorije: potkategorije }).then(function (azurirana) {
                if (!azurirana) {
                    res.json({ msg: 'Kategorija ne postoji.' });
                    return;
                }
                res.json({ msg: 'Kategorija je azurirana.' });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri azuriranju kategorije!' });
            });
        };
        this.obrisi = function (req, res) {
            var id = req.body._id;
            kategorija_1.default.deleteOne({ _id: id }).then(function () {
                res.json({ msg: 'Kategorija je obrisana.' });
            }).catch(function (err) {
                console.log(err);
                res.json({ msg: 'Greska pri brisanju kategorije!' });
            });
        };
    }
    return KategorijaController;
}());
exports.KategorijaController = KategorijaController;
