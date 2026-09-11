import express from 'express';
import { ProizvodController } from '../controllers/proizvod.controller';

const proizvodRouter = express.Router();

proizvodRouter.route('/pocetna').get(
    (req, res) => new ProizvodController().pocetna(req, res)
)

proizvodRouter.route('/kategorije').get(
    (req, res) => new ProizvodController().kategorije(req, res)
)

proizvodRouter.route('/pretraga').post(
    (req, res) => new ProizvodController().pretraga(req, res)
)

proizvodRouter.route('/svidi').post(
    (req, res) => new ProizvodController().svidi(req, res)
)

proizvodRouter.route('/nesvidi').post(
    (req, res) => new ProizvodController().nesvidi(req, res)
)

proizvodRouter.route('/komentarisi').post(
    (req, res) => new ProizvodController().komentarisi(req, res)
)

proizvodRouter.route('/zaStampariju').post(
    (req, res) => new ProizvodController().zaStampariju(req, res)
)

proizvodRouter.route('/dodaj').post(
    (req, res) => new ProizvodController().dodaj(req, res)
)

proizvodRouter.route('/azurirajProizvod').post(
    (req, res) => new ProizvodController().azurirajProizvod(req, res)
)

proizvodRouter.route('/obrisiProizvod').post(
    (req, res) => new ProizvodController().obrisiProizvod(req, res)
)

proizvodRouter.route('/ucitajIzFajla').post(
    (req, res) => new ProizvodController().ucitajIzFajla(req, res)
)

proizvodRouter.route('/otpremiSliku').post(
    (req, res) => new ProizvodController().otpremiSliku(req, res)
)

proizvodRouter.route('/:id').get(
    (req, res) => new ProizvodController().detalji(req, res)
)

export default proizvodRouter;
