import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let StavkaNarudzbine = new Schema({
    sifra: String,
    naziv: String,
    kolicina: Number,
    tipStampe: String,
    cenaPoKomadu: Number
}, { _id: false });

let Narudzbina = new Schema({
    klijentKorisnickoIme: {
        type: String,
        required: true
    },
    stamparijaKorisnickoIme: {
        type: String,
        required: true
    },
    stavke: {
        type: [StavkaNarudzbine],
        default: []
    },
    ukupanIznos: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['naruceno', 'placeno', 'u stampi', 'isporuceno', 'primljeno'],
        default: 'naruceno'
    },
    datumNarucivanja: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Narudzbina', Narudzbina, 'narudzbine');
