import express from 'express';
import { KategorijaController } from '../controllers/kategorija.controller';

const kategorijaRouter = express.Router();

kategorijaRouter.route('/sve').get(
    (req, res) => new KategorijaController().sve(req, res)
)

kategorijaRouter.route('/dodaj').post(
    (req, res) => new KategorijaController().dodaj(req, res)
)

kategorijaRouter.route('/izmeni').post(
    (req, res) => new KategorijaController().izmeni(req, res)
)

kategorijaRouter.route('/obrisi').post(
    (req, res) => new KategorijaController().obrisi(req, res)
)

export default kategorijaRouter;
