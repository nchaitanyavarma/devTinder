const validator = require("validator")

const signUpValidation = (data)=>{

    const {firstName,emailId,password} = data

    if(!firstName){
        throw new Error(" Please enter valid FirstName")
    }else if (!validator.isEmail(emailId)){
        throw new Error(" Please enter Valid Email")
    }else if (!validator.isStrongPassword(password)){
        throw new Error(" Please enter Valid Password")
    }
}
module.exports = signUpValidation