require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
// const { Resend } = require("resend");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// const resend = new Resend(process.env.RESEND_API_KEY);

const accountTransport = nodemailer.createTransport({
  service: "gmail",
  //   host: "mail.smtp2go.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 1,
  maxMessages: 5,
  rateDelta: 10000, // 10s between messages
  rateLimit: 5,
  logger: true,
  debug: true, // set false in production
});

app.get("/version", (req, res) => {
  res.send({ status: true, message: "v1" });
});

app.post("/sendEmail", (req, res) => {
  const from = req.body.from;
  const email = req.body.email;
  const subject = req.body.subject;
  const content = req.body.content;

  const mailOptions = {
    from: from,
    to: email,
    subject: subject,
    text: content,
  };

  if (email == "" || email == null) {
    res.send({ status: false, message: "Email Invalid" });
  } else {
    accountTransport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.send({ status: false, message: "Email Report Failed" });
      } else {
        res.send({ status: true, message: "Report has been Sent!" });
      }
    });
  }
});

// app.post("/sendEmail", async (req, res) => {
//   const { from, email, subject, content } = req.body;

//   if (!email || email.trim() === "") {
//     return res.json({ status: false, message: "Email Invalid" });
//   }

//   try {
//     const { data, error } = await resend.emails.send({
//       from:
//         `${from} <no.reply.automatedemailsystem@neonsystems.net>` ||
//         "no.reply.automatedemailsystem@neonsystems.net",
//       to: [email],
//       subject: subject,
//       html: `<p>${content}</p>`,
//       text: content,
//     });

//     if (error) {
//       console.error("Resend error:", error);
//       return res.json({ status: false, message: "Email failed to send" });
//     }

//     res.json({ status: true, message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Send error:", error);
//     res.json({ status: false, message: "Email service unavailable" });
//   }
// });

app.listen(PORT, () => {
  console.log("Server Running!");
});
