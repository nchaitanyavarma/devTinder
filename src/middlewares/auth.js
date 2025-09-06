const jwt = require("jsonwebtoken")
const User = require("../models/user")


const userAuth = async (req,res,next)=>{
    try{
        const cookies = req.cookies
        const {token} = cookies

        if(!token){
            throw new Error("Token is Invalid!!!!!!")
        }
        const decodedToken = await jwt.verify(token,"DEV@Tinder$777")
        const {_id} = decodedToken
        const user = await User.findById(_id)
        if(!user){
            throw new Error("No User!")
        }
        req.user = user
        next()

    }catch(error){
        res.status(400).send("Error" + error.message)
    }
}

module.exports = userAuth