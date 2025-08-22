const express = require("express")
const app = express()

app.use("/",(req,res)=>{
    res.send("hellloooooooo")
})

app.listen(3000, ()=>{
    console.log("dev server is runnning")
})