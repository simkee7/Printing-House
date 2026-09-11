import express from 'express';
import { NarudzbinaController } from '../controllers/narudzbina.controller';

const narudzbinaRouter = express.Router();

narudzbinaRouter.route('/moje').post(
    (req, res) => new NarudzbinaController().mojeNarudzbine(req, res)
)

narudzbinaRouter.route('/otkazi').post(
    (req, res) => new NarudzbinaController().otkazi(req, res)
)

narudzbinaRouter.route('/kreiraj').post(
    (req, res) => new NarudzbinaController().kreiraj(req, res)
)

narudzbinaRouter.route('/faktura/:id').get(
    (req, res) => new NarudzbinaController().faktura(req, res)
)

narudzbinaRouter.route('/arhiva').post(
    (req, res) => new NarudzbinaController().arhiva(req, res)
)

narudzbinaRouter.route('/potvrdiPrijem').post(
    (req, res) => new NarudzbinaController().potvrdiPrijem(req, res)
)

narudzbinaRouter.route('/zaStampariju').post(
    (req, res) => new NarudzbinaController().zaStampariju(req, res)
)

narudzbinaRouter.route('/sledeciKorak').post(
    (req, res) => new NarudzbinaController().sledeciKorak(req, res)
)

narudzbinaRouter.route('/izvestaj').post(
    (req, res) => new NarudzbinaController().izvestaj(req, res)
)

export default narudzbinaRouter;
