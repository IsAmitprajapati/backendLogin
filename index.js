import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors())

const db = "mongodb+srv://login:amitprajapati@cluster0.fijppff.mongodb.net/login?retryWrites=true&w=majority"


// "mongodb://127.0.0.1/loginsetup"

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify : false
}).then(()=>{
    console.log(`connection successful`)
}).catch((e)=>{
    console.log(e)
})

//schema
const userSchema = new mongoose.Schema({
    fname: String,
    lname:String,
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : String,
    mobile : Number
})
//model
const UserModel = new mongoose.model("UserModel", userSchema)

//Routes
// app.get("/", (req, res) => {
//     res.send("Amit Database connected")
// })

app.post("/login", (req, res) => {
    // res.send("my api login")
    const {email, password } = req.body;
    UserModel.findOne({email : email},(err,user)=>{
        if(user){
            if(password === user.password){
                res.send({message : "Login successfull",user : user})
            }
            else{
                res.send({message : "Password didn't match"})
            }
        }
        else{
            res.send({message : "User is not register"})
        }
    })

})

app.post("/register", async(req, res) => {
    // res.send("my api register")
    try{
        const { fname, lname,   email, password ,mobile} = req.body;
        // UserModel.findOne({ email :   email }, (err, user) => {
        //     if (user) {
        //         res.send({ message: "User already registerd" })
        //     }
        //     else {
        //         const registered = new UserModel({
        //             fname,
        //             lname,
        //             email,
        //             password,
        //         })
    
        //         const ress = await registered.save();
        //         res.status(201).render(index)
                
        //     }



        console.log(req.body)
        UserModel.findOne({email : email}, async(err,user)=>{
            if(user){
                res.send({message : "This email already register"})
            }
            else{
                const user = new UserModel({
                    fname,
                    lname,
                    mobile,
                    email,
                    password,
                    
                })
        
                const regested = await user.save();
                res.send({message : "Successfull register"})
            }
        })
        

    }
    catch (err){
        res.status(400).send(err)
    }
    
   



})

app.listen(8080, () => {
    console.log("BE started at port 9002")
})



// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/test');

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));

// main().catch(err => console.log(err));