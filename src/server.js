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
const ALLREQUEST = require('../model/Requests')
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




app.get("/Sign-Up/", async function (req, res) {
    res.render("Sign-Up")
})





app.get("/Sign-In", function (req, res) {
    res.render("Sign-In")
})




app.get("/Community/:token", async function (req, res) {

    const token = req.params['token'];

    var vals;
    var user_data
    var email;

    try {
        vals = await JWT.verify(token, JWTSEC);
        email = vals.email;
        user_data = await USER.findOne({ email }).lean();
    } catch {
        // console.log("ERROR");
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
                var buys = vals.buys;
                arr = ComHelper.PushPostData(arr, category, id, cost, content, title ,buys);
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

        var all = [];

        for (var i in arr){
            var data = arr[i];
            for (var j in data){
                all.push(data[j]);
            }
        }

        const compare = ( a, b ) => {
            if ( a[4] < b[4] ){
              return 1;
            }
            if ( a[4] > b[4] ){
              return -1;
            }
            return 0;
          }


        all = all.sort(compare).slice(0,5);


        const tokenrefer = await JWT.sign(email, JWTSEC);


        return res.render("community", { data: arr, name: user_name, coins: coin, user_email: email, refercode: tokenrefer , top_search : all});
    }
    res.send("Opssssss look like the resource you are looking for is not here<script>localStorage.removeItem('token');</script>");

})



app.get("/VerifyAccount", async function (req, res) {

    res.render('verifyotp');
})












app.get("/admin/requests/:password", async function (req, res) {

    const pass = req.params['password'];

    if (pass == process.env.ADMINPASS) {
        const result = await ALLREQUEST.find({});

        var arr = {};
        result.forEach((single) => {
            var category = single.category
            var data = single.data;
            data.forEach((vals) => {
                var email = vals.email;
                var title = vals.title;
                var content = vals.content;
                var cost = vals.cost;
                var id = vals._id;
                arr = ComHelper.PushRequest(arr, category, id, cost, content, title, email);

            })
        });


        return res.render('request', { data: arr });
    }else{
        res.redirect('/');
    }


})





app.get("/AddPost", async function (req, res) {
    res.render('AddPost');
})






app.get("/test", async function (req, res) {

    const test = await ALLPOST.find();
    
    console.log(test);

    res.send('OK');
})








app.post("/api/adminpost", async function (req, res) {
    // console.log(req.body);


    const { category, id , opr} = req.body;
    const requests = await ALLREQUEST.findOne( {category,data:{$elemMatch:{_id:id}}} ,{'data.$':1} ).lean();
    const data = requests.data;
    const email = data[0]['email'];
    const title = data[0]['title'];
    const content = data[0]['content'];
    const coin = data[0]['cost'];

    if (opr) {
        try {
            const result = await ALLPOST.findOne({ category });

            if (result) {
                const res = await ALLPOST.updateOne({ category: category }, { $push: { data: { title: title, content: content, cost: coin } } });
            } else {
                const res = await ALLPOST.create({ category: category, data: { title: title, content: content, cost: coin } });
            }

            try{
                const user = await USER.updateOne({email},{$inc:{coins:30}});
            }catch(err){
                console.log(err);
            }

        } catch (err) {
            // console.log(err);
            return res.json({ status: "err", data: "error while processing" })
        }
    }


    try {
        const result1 = await ALLREQUEST.updateOne({ category: category }, { $pull: { data: { _id: id } } }).lean();
        // console.log(result1);
    } catch (err) {
        console.log(err);
    }


    res.json({ status: "OK" });
});









app.post("/api/addpost", async function (req, res) {
    // console.log(req.body);
    const { category, title, content, coin, email } = req.body;


    try {
        const result = await ALLREQUEST.findOne({ category });

        if (result) {
            const res = await ALLREQUEST.updateOne({ category: category }, { $push: { data: { email: email, title: title, content: content, cost: coin } } });
        } else {
            const res = await ALLREQUEST.create({ category: category, data: { email: email, title: title, content: content, cost: coin } });
        }
    } catch (err) {
        console.log(err);
        return res.json({ status: "err", data: "error while processing" })
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

                const buys = await ALLPOST.updateOne({category , 'data._id':id } , { $inc:{'data.$.buys':1} } );
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
    const { fullname, email, password, referer: refercode } = req.body;
    // console.log(req.body);
    var referer = undefined;

    if (refercode.length > 1) {
        try {
            const token2 = await JWT.verify(refercode, JWTSEC);
            referer = token2;
        } catch {
            return res.json({ status: "error", data: "Refer code not valid" });
        }
    }


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
                coins: 100,
                PermaBan: false
            });
            if (referer) {
                try {
                    var ref = await USER.updateOne({ email: referer }, { $inc: { coins: 20, refers: 1 } }).lean();
                } catch {
                    // console.log(referer);
                }
            }
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

            if (result.verified == true && result.PermaBan == false) {

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