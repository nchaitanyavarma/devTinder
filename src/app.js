const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")
const signUpValidation = require("./utils/validators")
const bcrypt = require("bcrypt")
const cookieparser = require("cookie-parser")
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())
app.use(cookieparser())

app.post("/signup", async(req,res)=>{
    try{
        signUpValidation(req.body)
        const { password} = req.body
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({...req.body,password:hashedPassword})
        await user.save()
        res.send("User Added")
    }catch(err){
        res.status(400).send("Error in saving user" + err.message)
    }
})

app.post("/login",async(req,res)=>{
    try{
    const {emailId,password} = req.body
    const user = await User.findOne({emailId:emailId})
    if(!user){
        throw new Error("Invalid Credentials")
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(isPasswordValid){
        const token = await jwt.sign({_id : user._id},"DEV@Tinder$777")
        res.cookie("token", token)
        res.send("Login Successfull")
    }else{
         throw new Error("Invalid Credentials")
    }
    }catch(err){
        res.status(400).send("Error : " + err.message)
    }
})

app.get("/profile",async(req,res)=>{
  try{
    const cookies =  req.cookies
    const {token} = cookies
    if(!token){
        throw new Error("Invalid Token")
    }
    const decodedToken = await jwt.verify(token,"DEV@Tinder$777")
    const {_id} = decodedToken
    const user = await User.findById(_id)
    if(!user){
        throw new Error("User is Invalid")
    }
    res.send(user)
    }catch(err){
        res.status(400).send("Error : " + err.message)
    }
})

app.delete("/user", async(req,res)=>{
    const user = req.body.userId
    try{
        const users= await User.findByIdAndDelete(user)
        res.send(users)
    }catch(err){
        res.status(400).send("Error in deleting user" + err.message)
    }
})

app.patch("/user/:userId",async(req,res)=>{
    const userId = req.params?.userId
    const data = req.body
    const allowedUpdatedFields = ["photo","about","skills","age","gender"]
    const isAllowedUpdate = Object.keys(data).every(item=>allowedUpdatedFields.includes(item))
    try{
        if(!isAllowedUpdate){
            throw new Error("Invalid updates")
        }
        const users = await User.findByIdAndUpdate(userId,data,{
            runValidators:true,
        })
        res.send(users)
    }catch(err){
        res.status(400).send("Error in updating user" + err.message)
    }
})

app.get("/user",async(req,res)=>{
    const userEmail = req.body.emailId
    try{
        const users = await User.find({emailId:userEmail})
        if(users.length === 0){
            res.status(400).send("No user found")
        }else{
            res.send(users)
        }
    }catch(err){
        res.status(400).send("Error in fetching user" + err.message)    
    }

})

app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({})
        res.send(users)
    }catch(err){
        res.status(400).send("Error in fetching user" + err.message)    
    }   
})

connectDB()
    .then(()=>{
    console.log("Database connected");  
    app.listen(3000, ()=>{
    console.log("dev server is runnning")
        })
    })
    .catch((err)=>{   
        console.log("Database error");  
    })


