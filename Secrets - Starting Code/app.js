
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

/* Encryption methods */
// const md5 = require("md5");
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const encrypt = require("mongoose-encryption");
const app = express();

app.use(session({
    secret: 'secreet is seecret',
    resave: false,
    saveUninitialized: false,
    // cookie: { sameSite: "none", secure: false }

}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));


const url = "mongodb://0.0.0.0:27017/userDB";
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(url);
}



const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleID: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// const secrets = process.env.SECRETS;
// userSchema.plugin(encrypt, { secret: secrets, encryptedFields: ["password"] });

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/secrets",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile)
        User.findOrCreate({googleID: profile.id}, function(err,user){
            return cb(err,user);
        });
    }

))


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/auth/google", passport.authenticate("google", { scope: ['profile'] })
);

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
});

app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('secrets')
    } else {
        res.redirect("/login");

    }
});

app.get("/login", (req, res) => {
    res.render("login");


});

app.get('/logout', (req, res) => {
    req.logout((err)=>{
        console.log(err);
    });
    res.redirect("/");
})

app.get("/register", (req, res) => {
    res.render("register");
});


//register page 
app.post("/register", (req, res) => {

    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            })

        }
    })

});

//login not required right now just registration should work
app.post("/login", (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, function () {
                res.redirect('/secrets');
            })
        }
    })

});

app.listen(3000, () => {
    console.log("Server started on port 3000.");
});


// [
//     {
//       _id: ObjectId("6359441bf945678cce5db8f4"),
//       email: 'defcoder@gmail.com',
//       password: '123',
//       __v: 0
//     },
//     {
//       _id: ObjectId("63594c5c4df4a76cbbd56ce6"),
//       email: 'hol2@gmail.com',
//       password: 'gola',
//       __v: 0
//     }
// ]

/**Login and register authentication with hash encryption **/
/* login */
// const username = req.body.username;
// const password = req.body.password;
// // const password = md5(req.body.password);
// User.findOne({ email: username }, (err, foundUser) => {
//     if (!err) {
//         if (foundUser) {
//             bcrypt.compare(password, hash, function(err, result) {
//                 if (result === true) {
//                     res.render('secrets');
//                 } else {
//                     console.log("password does not match.");
//                 }
//             });
            
//         } else {
//             console.log("User not found.")
//         };
//     } else {
//         console.log(err);
//     };
// });

/*Register part */
// bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
//     if (!err) {
//         const newUser = new User({
//             email: req.body.username,
//             password: hash,
//             // password: md5(req.body.password), //hashed password generated using md5 
//         });

//         newUser.save((err) => {
//             if (!err) {
//                 res.render('secrets')
//             } else {
//                 console.log(err);
//             }
//         });
//     } else {
//         console.log(err);
//     };
// });
