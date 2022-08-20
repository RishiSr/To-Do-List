const express = require("express");
const mongoose = require('mongoose')
require('dotenv').config();

const jwt = require('jsonwebtoken');
mongoose.connect(`mongodb+srv://Rishi:${process.env.PASSWORD}@cluster0.5gomwqr.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    console.log("DB Connected");
});
const cookieParser = require('cookie-parser')
const app = express();
let path = require('path');
const bcrypt = require('bcryptjs')
let registermodel = require("./model/model")
let notemodel = require("./model/notemodel");
// const auth=require('./middleware/auth.js').default
const public_path = path.join(__dirname, 'public')
app.use(express.static('public'));
app.get("/register", (req, res) => {

    res.sendFile(`${public_path}/signup.html`);
});
app.use(express.json());
app.use(cookieParser());

app.use('/css', express.static('public/CSS'));
app.use(express.urlencoded({ extended: false }));//to get data fro the form
app.use(express.static(__dirname + '/public/'))
const midd = (req, res, next) => {
    if (req.body.password == req.body.password1) {
        next();

    }
    else {
        res.status(400).send("Wrong ppasword");
    }
}
const auth = (req, res, next) => {
    try {
        let cook = req.cookies.jwt;
        if (!cook) {
            res.redirect("/");

        } else {

            let user = jwt.verify(cook, process.env.SECRET_KEY);

            if (user) {

                next();
            }
            else {
                res.redirect("/login");
            }
        }
    }
    catch (err) {

        console.log(err);
    }
}

app.post("/register", midd, async (req, res) => {
    let username = await registermodel.findOne({ email: req.body.email })
    if (username == null) {

        let data = new registermodel({ name: req.body.name, email: req.body.email, password: req.body.password });

        //creation of token after regsration

        const token = await data.generateToken();//now call the fuynction for the data which is defines in model .js
        console.log(token);
        //using thw res.cookie to save the token in the Cookies

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true
        })
        data.save().then((result) => {
            console.log(result);

            //--------------------------------------------------------------------------
            let uid = result._id.toString();

            let data = new notemodel({
                id: uid,
                data: [

                ]
            });

            data.save().then((res) => {
                console.log(res);
            });
            res.sendFile(`${public_path}/index.html`);
        }).catch((err) => {
            res.status(400).send(err);
        })

    }
    else {
        res.cookie("message", "Email Exists", {
            expires: new Date(Date.now() + 900000000000),

        });
        res.redirect("/register")
    }
});
app.get("/login", (req, res) => {
    res.sendFile(`${public_path}/login.html`)
})

app.post("/login", async (req, res) => {
    let username = await registermodel.findOne({ email: req.body.email });//through this we can get all the data inside the username
    if (username) {
        let checkp = bcrypt.compareSync(req.body.password, username.password); // true
        if (checkp) {
            const token = await username.generateToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 900000000000),

                httpOnly: true
            });

            let findUsernameid = username._id.toString()
            let resultuid = await notemodel.findOne({ id: findUsernameid });




            //res.redirect("C:/Users/rishi/Desktop/To do list/public/notes.html")
            res.redirect("/getnote")

        }
        else {
            res.cookie("message", "Wrong Credentials", {
                expires: new Date(Date.now() + 900000000000),

            });
            res.redirect("/login")
        }
    }
    else {
        res.cookie("message", "Wrong Credentials", {
            expires: new Date(Date.now() + 900000000000),

        });
        res.redirect("/login")
    }


})

app.get("/getnote", auth, (req, res) => {

    res.sendFile("C:/Users/rishi/Desktop/To do list/public/notes.html");
})


// const walter = async () => {
//     let result = await registermodel.findOne({ email: "asdf@gmail.co" });

//     let uid = result._id.toString();
//     let today = new Date();
//     let today1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

//     var time1 = today.getHours() + ":" + today.getMinutes();
//     console.log(uid);
//     let notedata = await notemodel.findOne({ id: uid });

//     notedata.data = (notedata.data).concat({
//         note: "hemoljhjhjhd ",
//         date: today1,
//         time: time1
//     })

//     let result1 = await notedata.save();
//     return result1;


// }



// const insertnote = async () => {

//     let result = await registermodel.findOne({ email: "asdf@gmail.co" });

//     let uid = result._id.toString();
//     let data = new notemodel({
//         id: uid,
//         data: [

//         ]
//     });

//     data.save().then((res) => {
//         console.log(res);
//     })

// }
app.get("/note", auth, async (req, res) => {
    try {
        const cook = req.cookies.jwt;

        let user = jwt.verify(cook, process.env.SECRET_KEY);
        const data = await notemodel.findOne({ id: user._id.toString() }); console.log(data)
        res.send(data);
    }
    catch (err) {
        console.log(err);
    }
});
app.post("/addnote", auth, async (req, res) => {
    try {
        const cook = req.cookies.jwt;
        let user = jwt.verify(cook, process.env.SECRET_KEY);
        let notedata = await notemodel.findOne({ id: user._id.toString() });
        // console.log(req.body.task)
        let today = new Date();
        let today1 = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        var time1 = today.getHours() + ":" + today.getMinutes();
        notedata.data = (notedata.data).concat({
            note: req.body.note,
            date: today1,
            time: time1
        })
        let result = await notedata.save();

        res.send(notedata.data);

    }
    catch (err) {
        console.warn(err);
    }
})
app.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/");
})
app.delete("/delnote", async (req, res) => {
    try {
        let obj = Object.create(null);
        const cook = req.cookies.jwt;
        if (!cook) {
            res.send(obj)
        }
        else {
            let user = jwt.verify(cook, process.env.SECRET_KEY);
            let notedata = await notemodel.findOne({ id: user._id.toString() });
            for (i = 0; i < notedata.data.length; i++) {
                if (req.body.note == notedata.data[i]._id.toString()) {
                    var spliced = notedata.data.splice(i, 1);
                    break;
                }
            }
            let result = await notedata.save();
            res.send(result);
        }
    }
    catch (err) {
        console.log(err)
    }
})
//redirect to desired page
//don't forget to set Session["Back"] back to null
app.listen(3000);