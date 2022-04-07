

const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const database = require('./config/database');
const User = require('./model/user');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const auth = require('./middleware/auth');
const sendMail = require('./middleware/sendMail');
const Token = require('./model/token');
const crypto = require('crypto');



const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
database.connect();
app.use(express.json());

app.use(bodyparser.urlencoded({ extended: true })); 

app.post('/register', async (req, res) => {
    try {
        console.log(req.body);
        const { first_name, last_name, email, password } = req.body;

        if (!(email && first_name && last_name && password)) {
            res.status(400).json({mssg:"All Field Are Required"});
            return
        }
        const oldUser = await User.find({ email });

        if (oldUser.length > 0) {
            console.log(oldUser)
            res.status(400).json({mssg:"User already Exist"});
            return
        }

        encryptedPass = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPass
        });
        console.log(user);

        const token = jwt.sign({ user_id: user._id, email }, process.env.JWT_SECRET_TOKEN, { expiresIn: "2h" });
        user.token = token;

        console.log(user);

        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(404).send("error from server");
    }

})



app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).json({mssg:"All input is required"});
            return
        }
        const user = await User.findOne({ email });
        console.log(user);
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ user_id: user._id, email }, process.env.JWT_SECRET_TOKEN, { expiresIn: "2h" });
            user.token = token;

            res.status(200).json(user);
            return
        }

        res.status(400).json({mssg:"Invalid Credentials"});



    } catch (error) {
        console.log(error);
    }
})



app.post('/forgotPassword', async (req, res) => {
    email = req.body.email;


    const user = await User.find({ email });

    if (user[0]) {

        let token = await Token.findOne({ userId: user[0]._id });

        if (!token) {
            token = await new Token({
                userId: user[0]._id,
                token: crypto.randomUUID(),
            }).save();
        }

        console.log(token);



        const link = `${process.env.BASE_URL}password-reset/${user[0]._id}/${token.token}`;
        console.log(link);
        sendMail(email, "Password reset", link)
        return res.status(200).json({mssg:"Email sent"})

    }
    res.status(400).json({mssg:"Email does not exist"})
})



app.get('/password-reset/:userid/:token', async (req, res) => {
    try {

        
        const user = await User.findOne({_id:req.params.userid});
        if (!user) return res.status(400).send("invalid user link or expired");

        console.log(user._id);
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        console.log(token);
        if (!token) return res.status(400).send("Invalid link or expired");
        console.log(token);


        


       res.render("ResetPasswordPage",{action:`/password-change/${user._id}/${token.token}`});



    } catch (err) {
        console.log(err);
        res.send(err);
    }
})



app.post('/password-change/:userid/:token', async (req, res) => {
    try {


const pass = req.body.password;
encryptedPass = await bcrypt.hash(pass, 10);

const user = await User.findOne({_id:req.params.userid});

const token = await Token.findOne({token:req.params.token});


user.password = encryptedPass;
user.save();
token.delete();


        res.send("Your password is changed")
       

    } catch (err) {
        console.log(err);
        res.send(err);
    }
})



app.post('/logout/:userid',async (req,res)=>{
    
    const user = await User.findOne({_id:req.params.userid});
if(!user) return res.status(400).send("User Does not exist");
    user.token = null;
    user.save();
    console.log(user);
    res.status(200).json({mssg:"Logged-Out"})


})





app.post('/delete', async (req, res) => {
    email = req.body.email;
    const oldUser = await User.deleteOne({ email });

    res.status(200).send("well done");


})


app.post("/welcome", auth, (req, res) => {
    console.log(req.user);
    res.status(200).send("Welcome 🙌 ");
});









module.exports = app;