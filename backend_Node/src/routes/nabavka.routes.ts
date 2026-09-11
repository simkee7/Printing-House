import express from 'express';
import { NabavkaController } from '../controllers/nabavka.controller';

const nabavkaRouter = express.Router();

nabavkaRouter.route('/kreirajIzKorpe').post(
    (req, res) => new NabavkaController().kreirajIzKorpe(req, res)
)

nabavkaRouter.route('/moje').post(
    (req, res) => new NabavkaController().moje(req, res)
)

nabavkaRouter.route('/otvorene').get(
    (req, res) => new NabavkaController().otvorene(req, res)
)

nabavkaRouter.route('/mojePonude').post(
    (req, res) => new NabavkaController().mojePonude(req, res)
)

nabavkaRouter.route('/posaljiPonudu').post(
    (req, res) => new NabavkaController().posaljiPonudu(req, res)
)

nabavkaRouter.route('/izvestaj/:id').get(
    (req, res) => new NabavkaController().izvestaj(req, res)
)

nabavkaRouter.route('/:id').get(
    (req, res) => new NabavkaController().detalji(req, res)
)

export default nabavkaRouter;
