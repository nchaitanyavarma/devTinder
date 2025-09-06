const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required: true,
        minLength:4,
        maxLength:30
    },
    lastName : {
        type:String,
    },
    emailId : {
        type:String,  
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email " + value)
            }
        }
    },
    password : {
        type:String,
        required: true,
         validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password " + value)
            }
        }
    },
    age : {     
        type:Number, 
        min:18   
    },
    gender:{
        type:String,
        validate(value){
            if(["male","female","other"].includes(value) !== true){
                throw new Error("Gender data is not valid")
            }
        }
    },
    about:{
        type:String
    },
    photo:{
        type:String,
        default :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2_5z67_9w_D7bU4LdQJy2ponyHEparph_07p0LK3j4askGjPAX-rG9DFwfqEK1IT3Q6o&usqp=CAU",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL " + value)
            }
        }
    },
    skills:{
        type:[String]
    }
    },{
    timestamps:true
    })

userSchema.methods.getJwt = async function(){
    const user = this
    const token = await jwt.sign({_id : user._id},"DEV@Tinder$777", {
        expiresIn :"7d"
    })

    return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this
    const hashedPassword = user.password
    const isValidPassword = await bcrypt.compare(passwordInputByUser, hashedPassword)
    return isValidPassword
}

const User = mongoose.model("User", userSchema)
module.exports = User
