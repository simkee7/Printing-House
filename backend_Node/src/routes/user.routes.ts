import express from 'express';
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.route('/login').post(
    (req, res) => new UserController().login(req, res)
)

userRouter.route('/getUser').post(
    (req, res) => new UserController().getUser(req, res)
)

userRouter.route('/register').post(
    (req, res) => new UserController().register(req, res)
)

userRouter.route('/promeniLozinku').post(
    (req, res) => new UserController().promeniLozinku(req, res)
)

userRouter.route('/zaboravljenaLozinka').post(
    (req, res) => new UserController().zaboravljenaLozinka(req, res)
)

userRouter.route('/resetujLozinku').post(
    (req, res) => new UserController().resetujLozinku(req, res)
)

userRouter.route('/azurirajProfil').post(
    (req, res) => new UserController().azurirajProfil(req, res)
)

userRouter.route('/getStamparija').post(
    (req, res) => new UserController().getStamparija(req, res)
)

export default userRouter;