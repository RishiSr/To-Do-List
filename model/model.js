const mongoose=require('mongoose');
const bcrypt = require("bcryptjs")
const jwt=require('jsonwebtoken');

require('dotenv').config();

const registerschema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    tokens:[{//constaing the array of token to stores name must be "tokens"
        token:String
    }
    ]
});
//no fat arrwir function as this keywrd
registerschema.methods.generateToken=async function(){
try{
const token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
this.tokens=this.tokens.concat({token:token});//this will add the token value in the data

return token;
}
catch(err){
    console.log(err);
}
}
registerschema.pre("save", async function(next){
    try{

        this.password=await bcrypt.hash(this.password,10);
        next();
    }
    catch(err){
        console.log(err);
    }
})

let registermodel=mongoose.model("register",registerschema);
module.exports=registermodel;