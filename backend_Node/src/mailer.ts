const nodemailer = require('nodemailer');

let transporterPromise: Promise<any> | null = null;

function napraviTransporter(): Promise<any> {
    if (!transporterPromise) {
        transporterPromise = (async () => {
            if (process.env.SMTP_HOST) {
                return nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT) || 587,
                    secure: false,
                    auth: process.env.SMTP_USER
                        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                        : undefined
                });
            }

            let testNalog = await nodemailer.createTestAccount();
            return nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: { user: testNalog.user, pass: testNalog.pass }
            });
        })();
    }
    return transporterPromise;
}

async function posaljiMejl(opcije: { to: string, subject: string, text: string, attachments?: any[] }): Promise<void> {
    if (!opcije.to) return;

    try {
        let transporter = await napraviTransporter();

        let info = await transporter.sendMail({
            from: '"Printing House" <no-reply@printinghouse.rs>',
            to: opcije.to,
            subject: opcije.subject,
            text: opcije.text,
            attachments: opcije.attachments
        });

        let previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log(`Mejl "${opcije.subject}" poslat (test nalog) - pregled: ${previewUrl}`);
        } else {
            console.log(`Mejl "${opcije.subject}" uspesno poslat na ${opcije.to}.`);
        }
    } catch (err) {
        console.log('Greska pri slanju mejla:', err);
    }
}

export async function posaljiFakturuMejlom(email: string, imeKlijenta: string, brojFakture: string, pdfBuffer: Buffer): Promise<void> {
    await posaljiMejl({
        to: email,
        subject: `Faktura br. ${brojFakture}`,
        text: `Postovani/a ${imeKlijenta},\n\nU prilogu se nalazi faktura za Vasu narudzbinu br. ${brojFakture}.\n\nHvala na poverenju.`,
        attachments: [
            { filename: `faktura_${brojFakture}.pdf`, content: pdfBuffer }
        ]
    });
}

export async function posaljiObavestenjeONabavci(email: string, stavke: any[], rokZaPonude: Date): Promise<void> {
    let spisak = stavke.map(s => `- ${s.naziv}${s.kategorija ? ' (' + s.kategorija + ')' : ''} x ${s.kolicina}`).join('\n');

    await posaljiMejl({
        to: email,
        subject: 'Otvorena je nova javna nabavka',
        text: `Postovani,\n\nOtvorena je licitacija za novu javnu nabavku. Trazeni proizvodi:\n\n${spisak}\n\nRok za dostavljanje ponuda: ${new Date(rokZaPonude).toLocaleString('sr-RS')}.\n\nPonudu mozete poslati prijavom na sistem, u okviru stranice za javne nabavke.`
    });
}
