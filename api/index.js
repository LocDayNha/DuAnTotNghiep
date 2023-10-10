const express = require ("express");
const bodeyParser = require ( "body-parser");
const mongoose = require ("mongoose");
const crypto = require ("crypto");
const nodemailer = require ("nodemailer");

const app = express();
const port = 8000;
const cors = require ("cors");
const bodyParser = require("body-parser");
app.use(cors());

app.use(bodeyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const jwt = require ("jsonwebtoken");

//connect database
//mongodb://127.0.0.1:27017/
mongoose.connect('mongodb+srv://tungh3210:tung@cluster0.cmonbw2.mongodb.net/GraduationProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch(err => console.log('>>>>>>>>> DB Error: ', err));
  
app.listen(port, "192.168.1.7" ,() => {
    console.log("Server is running on port")
})

const User = require ("./models/user");
const Order = require ("./models/order");


//function to send verification email to the user
const sendVerificationEmail = async (email, verificationToken) => {
    //create a nodemailer transport
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "tungh3210@gmail.com",
            pass: "xebq pybq ssyw ituo"
        }
    })

    //compose the email message
    const mailOptions = {
        from: "amazon.com",
        to: email,
        subject: "Email Verification",
        text: `Plsase click the following link to verify your account : http://192.168.1.7:8000/verify/${verificationToken}`
    };

    //send the email
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error sending verification email", error);
    }
};


//endpoint to register in the app
// http://192.168.1.7:8000/register
app.post("/register",async(req,res) => {
    try {
        const {name, email,password} = req.body;

        //check if the email is already registered
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({message: "Email already registered!"});
        }

        //create new user
        const newUser = new User({name,email,password});


        //generate and store the verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        //save the user to the database
        await newUser.save();

        //send the verification email to the user
        sendVerificationEmail(newUser.email, newUser.verificationToken);
        res.status(200).json({message: "Registration successful! We have send you a verifycation to your email"});
    } catch (error) {
        console.log("error registering user!", error);
        res.status(500).json({message: "Registration failed!"});
    }
});

    //endpoint to verify email
    app.get("/verify/:token", async(req,res) => {
        try {
            const token = req.params.token;

            //find the user with the given verification token
            const user = await User.findOne({verificationToken: token});
            if(!user){
                return res.status(404).json({message: "Invalid verification token"});
            }

            //Mark the user as verified
            user.verified = true;
            user.verificationToken = undefined;

            await user.save();
            res.status(200).json({message: "Email verified successfully"})
        } catch (error) {
            res.status(500).json({message: "Email Verification Failed!"});
        }
    })