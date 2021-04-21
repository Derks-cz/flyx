const {Schema,model,ObjectId} = require("mongoose")

const User = Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    name:{type:String, required:true},
    surname:{type:String,required:true},
    invitesTo:[{type:ObjectId,ref:"Users"}],
    invitesFrom:[{type:ObjectId,ref:"Users"}],
    brithday:{day:{type:Number,required:true}, month:{type:String,required:true},year:{type:Number,required:true}},
    dialogs:[{type:ObjectId,ref:"Users"}],
    chatPriority:{type:Number,required:true},
    friend:[{type:ObjectId, ref:"Users"}],
    blackList:[{type:ObjectId, ref:"Users"}]
})

module.exports = model("Users",User)