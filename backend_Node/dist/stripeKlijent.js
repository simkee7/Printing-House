"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dobaviStripe = dobaviStripe;
// Stripe TEST MODE klijent za obradu placanja karticom u e-korpi.
// Tajni kljuc (sk_test_...) se NIKAD ne pise direktno u kod - cita se iz .env fajla
// (backend_Node/.env, promenljiva STRIPE_SECRET_KEY), koji ne treba da se deli/komituje.
var stripe_1 = __importDefault(require("stripe"));
var stripeKlijent = null;
function dobaviStripe() {
    if (stripeKlijent)
        return stripeKlijent;
    var tajniKljuc = process.env.STRIPE_SECRET_KEY;
    if (!tajniKljuc)
        return null;
    stripeKlijent = new stripe_1.default(tajniKljuc);
    return stripeKlijent;
}
