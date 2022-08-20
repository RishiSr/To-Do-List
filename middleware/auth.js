const express=require("express");
const jwt=require("jsonwebtoken");
const cookieParser=require('cookie-parser');
const app=express();
app.use(cookieParser());
const auth=(req,res,next)=>{
try{let cook=req.cookies.jwt;
    let user=jwt.verify(cook,process.env.SECRET_KEY);
    console.log(user);
//     if(user){
        
//     }
//     else{
      
//     }
}
catch(err){
    console.log(err);
}
}

module.exports=auth;