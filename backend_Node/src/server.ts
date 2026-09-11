import express, { Router } from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import userRouter from './routes/user.routes';
import proizvodRouter from './routes/proizvod.routes';
import narudzbinaRouter from './routes/narudzbina.routes';
import nabavkaRouter from './routes/nabavka.routes';
import adminRouter from './routes/admin.routes';
import kategorijaRouter from './routes/kategorija.routes';

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

mongoose.connect("mongodb://127.0.0.1:27017/projekat2026")
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("db connection ok")
})

const router = Router()
router.use('/user', userRouter)
router.use('/proizvod', proizvodRouter)
router.use('/narudzbina', narudzbinaRouter)
router.use('/nabavka', nabavkaRouter)
router.use('/admin', adminRouter)
router.use('/kategorija', kategorijaRouter)
app.use('/', router)
app.use('/uploads/profile_pics', express.static('uploads/profile_pics'));
app.use('/uploads/proizvodi', express.static('uploads/proizvodi'));

app.listen(4000, () => console.log(`Express server running on port 4000`));