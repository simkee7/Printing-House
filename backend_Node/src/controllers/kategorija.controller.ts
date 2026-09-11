import * as express from 'express';
import Kategorija from '../models/kategorija';

export class KategorijaController {

    sve = (req: express.Request, res: express.Response) => {
        Kategorija.find({}).sort({ naziv: 1 }).then(kategorije => {
            res.json(kategorije);
        }).catch(err => {
            console.log(err);
            res.json([]);
        });
    }

    dodaj = (req: express.Request, res: express.Response) => {
        let naziv = req.body.naziv;
        let potkategorije = req.body.potkategorije || [];

        new Kategorija({ naziv: naziv, potkategorije: potkategorije }).save().then(sacuvana => {
            res.json({ msg: 'Kategorija je dodata.', kategorija: sacuvana });
        }).catch((err: any) => {
            console.log(err);
            if (err.code === 11000) {
                res.json({ msg: 'Kategorija sa tim nazivom vec postoji.' });
                return;
            }
            res.json({ msg: 'Greska pri dodavanju kategorije!' });
        });
    }

    izmeni = (req: express.Request, res: express.Response) => {
        let id = req.body._id;
        let naziv = req.body.naziv;
        let potkategorije = req.body.potkategorije || [];

        Kategorija.findByIdAndUpdate(id, { naziv: naziv, potkategorije: potkategorije }).then((azurirana) => {
            if (!azurirana) {
                res.json({ msg: 'Kategorija ne postoji.' });
                return;
            }
            res.json({ msg: 'Kategorija je azurirana.' });
        }).catch((err: any) => {
            console.log(err);
            res.json({ msg: 'Greska pri azuriranju kategorije!' });
        });
    }

    obrisi = (req: express.Request, res: express.Response) => {
        let id = req.body._id;

        Kategorija.deleteOne({ _id: id }).then(() => {
            res.json({ msg: 'Kategorija je obrisana.' });
        }).catch(err => {
            console.log(err);
            res.json({ msg: 'Greska pri brisanju kategorije!' });
        });
    }
}
