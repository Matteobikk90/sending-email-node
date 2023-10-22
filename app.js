import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());
app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

const sendEmailBooking = async ({
    name,
    surname,
    email,
    phone,
    readable_start_time,
    service
}) => {
    const emailTemplateBody = `
            <p>Ciao <strong>${name},</strong></p>
            <p>Di seguito i dettagli della tua prenotazione:</p>
            <p>&nbsp;</p>
            <p>Nome: <strong>${name}</strong></p>
            <p>Cognome: <strong>${surname}</strong></p>
            <p>Email: <strong>${email}</strong></p>
            <p>Telefono: <strong>${phone}</strong></p>
            <p>Data: <strong>${readable_start_time}</strong></p>
            <p>Servizio: <strong>${service}</strong></p>
            <p>&nbsp;</p>
            <p>Saluti,</p>
            <p>Blendon Barber Shop</p>
        `;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        from: process.env.EMAIL,
        port: 587,
        secure: false,
        requireTLS: true
    });
    const mail_configs = {
        from: process.env.EMAIL,
        to: email,
        subject: "Blendon Barber Shop - Prenotazione effettuata con successo",
        html: emailTemplateBody
    };
    return await transporter
        .sendMail(mail_configs)
        .then(() => "Email correctly sent")
        .catch(() => "Email not sent");
};

const sendContactEmail = async ({ name, email, phone, message }) => {
    const emailTemplateBody = `
            <p>Nome: <strong>${name}</strong>,</p>
            <p>Telefono: <strong>${phone}</strong></p>
            <p>Email: <strong>${email}</strong>:</p>
            <p>Messaggio: <strong>${message}</strong></p>
        `;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
        from: process.env.EMAIL,
        port: 587,
        secure: false,
        requireTLS: true
    });
    const mail_configs = {
        from: process.env.EMAIL,
        to: email,
        subject: `Informazioni da ${name}`,
        html: emailTemplateBody
    };
    return await transporter
        .sendMail(mail_configs)
        .then(() => "Email correctly sent")
        .catch(() => "Email not sent");
};

app.post(
    "/send_email_booking",
    async (req, res) =>
        await sendEmailBooking(req.body)
            .then((response) => res.send(response))
            .catch((error) => res.status(500).send(error))
);

app.post(
    "/send_contact_email",
    async (req, res) =>
        await sendContactEmail(req.body)
            .then((response) => res.send(response))
            .catch((error) => res.status(500).send(error))
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
