import mongoose, { CallbackWithoutResultAndOptionalError } from 'mongoose'
import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema;

let User = new Schema({
    ime: {
        type: String,
        required: true
    },
    prezime: {
        type: String,
        required: true
    },
    korisnickoIme: {
        type: String,
        required: true,
        unique: true
    },
    lozinka: {
        type: String,
        required: true
    },
    tip: {
        type: String,
        required: true,
        enum: ['fizicko lice', 'pravno lice', 'stamparija', 'admin']
    },
    telefon: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    aktivan: {
        type: Boolean,
        default: false
    },
    slika: {
        type: String,
        default: 'default_profile_image.jpg'
    },
    nazivInstitucije: String,
    adresaSedista: String,
    MB: {
        type: String,
        unique: true,
        sparse: true,
        match: [/^\d{8}$/, 'Maticni broj mora imati tacno 8 cifara.']
    },
    PIB: {
        type: String,
        unique: true,
        sparse: true,
        match: [/^[1-9]\d{8}$/, 'PIB mora imati 9 cifara i ne sme poceti nulom.']
    },
    tokenZaResetovanje: String,
    tokenIstice: Date
});

User.pre('save', async function (this: any, next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('lozinka')) return next();

    try {
        this.lozinka = await bcrypt.hash(this.lozinka, 10);
        next();
    } catch (err: any) {
        next(err);
    }
});

export default mongoose.model('User', User, 'korisnici');