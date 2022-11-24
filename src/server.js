const express = require('express')
const mongoose = require('mongoose')
const helper = require('../function/helper')
const ComHelper = require('../function/community')
const JWT = require('jsonwebtoken')


const bcrypt = require('bcrypt');
const salts = 10;


const USER = require('../model/user')
const OTP = require('../model/Otp')
const ALLPOST = require('../model/allpost')
const community = require('../function/community')


require('dotenv').config()


const app = express()


const DatabaseUrl = process.env.DATABASE
const JWTSEC = process.env.JWT_SECRET


mongoose.connect(DatabaseUrl).then(() => { console.log("MongoDB connected") });





app.use(express.static("Public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")


app.get("/", function (req, res) {
    res.render("home")
})





app.get("/forget-password", function (req, res) {
    res.render("ForgotPassword")
})




app.get("/Sign-Up", function (req, res) {
    res.render("Sign-Up")
})




app.get("/Sign-In", function (req, res) {
    res.render("Sign-In")
})




app.get("/Community/:token", async function (req, res) {

    const token = req.params['token'];

    var vals;
    var user_data

    try {
        vals = await JWT.verify(token, JWTSEC);
        const email = vals.email;
        user_data = await USER.findOne({ email }).lean();
    } catch {
        console.log("ERROR");
    }
    if (vals && user_data) {
        var arr = {};
        var user = {};
        const result = await ALLPOST.find({});

        result.forEach((single) => {
            var category = single.category
            var data = single.data;
            data.forEach((vals) => {
                var title = vals.title;
                var content = vals.content;
                var cost = vals.cost;
                var id = vals._id;
                arr = ComHelper.PushPostData(arr,category,id,cost,content,title);
                
            })
        })

        
        const user_name = user_data.name;
        const coin = helper.formatter(user_data.coins, 1);
        const subs = user_data.subs;
        const email = vals.email;
        
        
        subs.forEach(async function (single) {
            user = ComHelper.PushUserData(user, single.category, single.id);
        });
        
        arr = ComHelper.ValidateData(user, arr);
        
        console.log(arr);
        return res.render("Community", { data: arr, name: user_name, coins: coin, user_email: email });
    }
    res.send("Opssssss look like the resource you are looking for is not here");

})



app.get("/VerifyAccount", async function (req, res) {

    res.render('verifyotp');
})












app.get("/AddPost", async function (req, res) {
    res.render('AddPost');
})






app.get("/test", async function (req, res) {
    res.send('OK');
})








app.post("/api/addpost", async function (req, res) {
    // console.log(req.body);
    const { category, title, content, coin, adminpass } = req.body;

    if (adminpass === process.env.ADMINPASS) {
        try {
            const result = await ALLPOST.findOne({ category });

            if (result) {
                const res = await ALLPOST.updateOne({ category: category, $push: { data: { title: title, content: content, cost: coin } } });
            } else {
                const res = await ALLPOST.create({ category: category, data: { title: title, content: content, cost: coin } });
            }
        } catch (err) {
            console.log(err);
            return res.json({ status: "err", data: "error while processing" })
        }
    } else {
        return res.json({ status: "err", data: "invalid password" })
    }

    res.json({ status: "OK" });
});







app.post("/api/addid", async function (req, res) {

    const { email, category, id, cost } = req.body;
    const value = cost * -1;
    try {
        var user = await USER.findOne({ email });

        if (user.coins >= cost) {
            const result = await USER.updateOne({ email },
                {
                    $push:
                    {
                        subs: { category, id }
                    },
                    $inc: { coins: value }
                }).lean();
        }
        else {
            return res.json({ status: 'error', data: "1800" });
        }
    } catch {
        return res.json({ status: 'error', data: "server error" });
    }

    res.json({ status: 'OK' });
})






function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}

function containsNumbers(str) {
    return /\d/.test(str);
}


function containsAlpha(str) {
    const alpha = /[QWERTDNEpUTHQoQUJMHLrErGJyHg89uy71MyuHdfghjklzxcvbnm]/;
    return alpha.test(str);
}






app.post("/api/signup", async function (req, res) {
    var f = 0;
    const { fullname, email, password } = req.body;

    if (password.length < 5) {
        return res.json({ status: "error", data: "Password Length less than 5 characters" });
    }
    else if (containsSpecialChars(password) == false) {
        return res.json({ status: "error", data: "Password must contain a special character" });
    }
    else if (containsNumbers(password) == false) {
        return res.json({ status: "error", data: "Password must contain a number" });
    }



    try {
        var result = await USER.findOne({ email: email }).lean();
        const hashedpassword = await bcrypt.hash(password, salts);
        if (result == null) {
            var user = await USER.create({
                email: email,
                name: fullname,
                password: hashedpassword,
                verified: false,
                coins: 100
            });
            f = 1;
        } else {
            return res.json({ status: "error", data: "1400" });
        }
    }
    catch (err) {
        console.log(err);
    }

    // console.log(req.body);
    if (f == 1) {
        return res.json({ status: "OK", data: "verified" });
    }
    res.json({ status: "error", data: "Server Error" });
})



app.post("/api/verifyotp", async function (req, res) {
    const { email, password, Otp, newpass } = req.body;
    // console.log(req.body);

    var entered_otp = 0;

    try {
        entered_otp = parseInt(Otp);
    } catch {
        return res.json({ status: "error", data: "OTP Invalid" });
    }

    try {
        const result = await OTP.findOne({ email });
        if (result.otp == entered_otp) {

            if (newpass) {

                const hashedpass = await bcrypt.hash(newpass, salts);

                const us = await USER.updateOne({ email }, { $set: { password: hashedpass } });

            } else {

                const us = await USER.updateOne({ email }, { $set: { verified: true } });

            }

            return res.json({ status: "OK", data: "Verified" });
        } else {
            return res.json({ status: "error", data: "OTP Invalid" });
        }
    } catch {
        console.log("Error in verify OTP")
    }


    return res.json({ status: "OK", data: "verified" });

});






app.post("/api/signin", async function (req, res) {
    var f = 0;

    const { email, password, otpaccess } = req.body;


    if (password.length < 5) {
        return res.json({ status: "error", data: "Password Length less than 5 characters" });
    }
    else if (containsSpecialChars(password) == false) {
        return res.json({ status: "error", data: "Password must contain a special character" });
    }
    else if (containsNumbers(password) == false) {
        return res.json({ status: "error", data: "Password must contain a number" });
    }



    try {
        var result = await USER.findOne({ email: email }).lean();
        const userpass = result.password;

        const hashedpassword = await bcrypt.hash(password, salts);

        if (result == null) {
            return res.json({ status: "error", data: "404" });

        } else if (await bcrypt.compare(password, userpass)) {

            if (otpaccess == true) {
                var result = await helper.SendOtp(email);
                return res.json({ status: "OK", data: "OTP SENT" });
            }

            if (result.verified == true) {

                const data = {
                    email: email,
                    password: password
                };

                const token = await JWT.sign(data, JWTSEC);
                return res.json({ status: "OK", data: token });
            }
            else {
                return res.json({ status: "error", data: "1000" });
            }
        }
        else {
            return res.json({ status: "error", data: "900" });
        }
    }
    catch (err) {
        console.log(err);
    }

    res.json({ status: "error", data: "Server Error" });
})



app.get('*', (req, res) => {
    res.redirect('/')
})



app.listen(2000, function (err) {
    if (err) {
        console.log(err)
    }
    else {
        console.log("Server running on port 2000")
        console.log("%s", "http://localhost:2000")
    }
});