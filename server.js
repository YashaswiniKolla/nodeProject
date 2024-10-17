const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
require('dotenv').config();
const jwt = require('jsonwebtoken')
app.set("view engine","ejs");
app.use(cookieParser());


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.once('open', () => {
    console.log("Successfully logged to db");
    console.log(db.collections)
})

db.on('error', () => {
    console.log("Error Occurred");
    
})

app.get('/',(req,res) => {
    const {token} = req.cookies;
    if(token) {
        const tokenData = jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(tokenData.type == 'user'){
            res.render('home');
        }
    }
else {
        res.redirect('/signin');
    }
})

app.get('/signin',(req,res) => {
    res.render('signin')
})
app.get('/signup',(req,res) => {
    res.render('signup')
})

app.post('/signup', async (req,res) => {
    const {name,email,password: plainTextPassword} = req.body;
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hashSync(plainTextPassword, salt);

    try{
        await user.create({
            name,
            email,
            password:encryptedPassword
        });
        res.redirect('/signin');
    }catch(error) {
        console.log(error);
    }
})

app.post('/signin',async(req,res) => {
    const {email, password} = req.body;
    const userObj = await user.findOne({email});

    if(!userObj) {
        res.send({error:"user doesn't exist", status:404})
    }

    if(await bcrypt.compare(password,userObj.password)) {
        //creating jwt token
        const token = jwt.sign({
            userId: userObj._id, email: email, type: 'user'
        }, process.env.JWT_SECRET_KEY, {expiresIn:'2h'});
        res.cookie('token', token, {maxAge:2*60*60*1000});
        res.redirect('/');
    }
})
const userRouter = require('./routes/user')
const user = require('./models/user')

app.use('/Users', userRouter);


app.listen(5000)
console.log('server is listening')