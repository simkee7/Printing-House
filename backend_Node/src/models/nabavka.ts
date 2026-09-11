import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let StavkaNabavke = new Schema({
    naziv: String,
    kategorija: String,
    kolicina: Number,
    orijentacionaCenaPoKomadu: Number
}, { _id: false });

let Ponuda = new Schema({
    stamparijaKorisnickoIme: String,
    cenaUkupno: Number,
    rokIsporukeDana: Number,
    datumPonude: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

let Nabavka = new Schema({
    klijentKorisnickoIme: {
        type: String,
        required: true
    },
    stavke: {
        type: [StavkaNabavke],
        default: []
    },
    rokZaPonude: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['otvorena', 'zatvorena', 'zavrsena'],
        default: 'otvorena'
    },
    ponude: {
        type: [Ponuda],
        default: []
    },
    pobednikKorisnickoIme: String,
    datumKreiranja: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Nabavka', Nabavka, 'nabavke');
