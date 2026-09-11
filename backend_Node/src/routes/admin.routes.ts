import express from 'express';
import { AdminController } from '../controllers/admin.controller';

const adminRouter = express.Router();

adminRouter.route('/sviKorisnici').get(
    (req, res) => new AdminController().sviKorisnici(req, res)
)

adminRouter.route('/odobriKorisnika').post(
    (req, res) => new AdminController().odobriKorisnika(req, res)
)

adminRouter.route('/deaktivirajKorisnika').post(
    (req, res) => new AdminController().deaktivirajKorisnika(req, res)
)

adminRouter.route('/obrisiKorisnika').post(
    (req, res) => new AdminController().obrisiKorisnika(req, res)
)

adminRouter.route('/azurirajKorisnika').post(
    (req, res) => new AdminController().azurirajKorisnika(req, res)
)

adminRouter.route('/statistika').get(
    (req, res) => new AdminController().statistika(req, res)
)

adminRouter.route('/prometPoStamparijama').get(
    (req, res) => new AdminController().prometPoStamparijama(req, res)
)

adminRouter.route('/najtrazenijiProizvodiMesec').get(
    (req, res) => new AdminController().najtrazenijiProizvodiMesec(req, res)
)

adminRouter.route('/ocenaProizvodaKrozVreme').get(
    (req, res) => new AdminController().ocenaProizvodaKrozVreme(req, res)
)

export default adminRouter;
