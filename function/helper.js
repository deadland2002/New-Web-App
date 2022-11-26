const nodemailer = require('nodemailer')
const Otp = require('../model/Otp.js')


module.exports = {
    shuffle: function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    },

    formatter: function nFormatter(num, digits) {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function (item) {
            return num >= item.value;
        });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    },

    SendOtp: async function SendOtp(email) {
        var newotp = Math.floor(100000 + Math.random() * 900000);
        // console.log(newotp);

        try {
            const OtpRes = await Otp.create({
                "email": email,
                "otp": newotp
            });
        }
        catch (err) {
            const OtpSet = await Otp.updateOne({ email }, { $set: { 'otp': newotp } });
        }

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            },
        });

        const mailoption = {
            from: process.env.EMAIL,
            to: email,
            subject: "OTP for Email confirmation",
            html: `<h3> ${newotp} </h3>`
        }


        let info = await transporter.sendMail(mailoption, async function (err, data) {
            if (err) {
                console.log("send mail err");
                console.log(err);
            }
            else {
                // console.log("mail sent");
            }
        });
    },
    CheckHelper: function check(){
            console.log("Helper Online");
    }
}