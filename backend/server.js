const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.static('public'));

// Simulate database for available slots
const availableSlots = [
    { date: '2024-06-01', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
    { date: '2024-06-02', times: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
    // Add more dates and times as needed
];

app.get('/available-slots', (req, res) => {
    res.json(availableSlots);
});

app.post('/send-email', (req, res) => {
    const { name, email, phone, date, time, needs } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.DENTIST_EMAIL,
        subject: 'Nouveau Rendez-vous Patient',
        text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nDate: ${date}\nHeure: ${time}\nBesoins: ${needs}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
