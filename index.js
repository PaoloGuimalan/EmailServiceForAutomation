const express = require("express")
const app = express();
const PORT = process.env.PORT || 3001
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")

app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200
}))

const accountTransport = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth:{
        user: "no.reply.automatedemailsystem@gmail.com",
        pass: "sohpocttkoopvkqu"
    }
})

app.get('/version', (req, res) => {
    res.send({status: true, message: "v1"})
})

app.post('/sendEmail', (req, res) => {
    const from = req.body.from;
    const email = req.body.email;
    const subject = req.body.subject;
    const content = req.body.content;

    const mailOptions = {
        from: from,
        to: email,
        subject: subject,
        text: content
    }

    if(email == "" || email == null){
        res.send({status: false, message: "Email Invalid"})
    }
    else{
        accountTransport.sendMail(mailOptions, (err, info) => {
            if(err){
                console.log(err);
                res.send({status: false, message: "Email Report Failed"})
            }
            else{
                res.send({status: true, message: "Report has been Sent!"})
            }
        })
    }
})

app.listen(PORT, () => {
    console.log("Server Running!")
})