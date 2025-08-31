const validator = require("validator")

const signUpValidation = (data)=>{

    const {firstName,emailId,password} = data

    if(!firstName){
        throw new Error("Enter valid FirstName")
    }else if (!validator.isEmail(emailId)){
        throw new Error("Enter Valid Email")
    }else if (!validator.isStrongPassword(password)){
        throw new Error("Enter Valid Password")
    }
}
module.exports = signUpValidation