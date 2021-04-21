const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const config = require("../../config.json")
const User = require('../../models/User')
const express = require('express');
const router = express.Router();

    router.get("/user",async (req,res)=>{
        const {token} = req.cookies
        try{
        const jwtToken = jwt.verify(token,config.jwt) 
        const user = await User.aggregate([
            {
                "$match":{
                    "_id": mongoose.Types.ObjectId(jwtToken.id)
                }},
                {
                "$lookup":{
                    "from":"users",
                    "localField":"friend",
                    "foreignField":"_id",
                    "as":"friends"
                },
            },
            {
                "$lookup":{
                    "from":"users",
                    "localField":"dialogs",
                    "foreignField":"_id",
                    "as":"my_dialogs"
                }
            },
            {"$project":{"friends.password":0,"friends.email":0,"friends.friend":0,"friends.blackList":0,"friends.dialogs":0,"friends.invitesTo":0,"friends.invitesFrom":0,"friends.chatPriority":0}},
            {"$project":{"my_dialogs.password":0,"my_dialogs.email":0,"my_dialogs.friend":0,"my_dialogs.blackList":0,"my_dialogs.dialogs":0,"my_dialogs.invitesTo":0,"my_dialogs.invitesFrom":0,"my_dialogs.chatPriority":0,"my_dialogs.brithday":0}}
        ])
        res.send({id:user[0]._id,dialogs:user[0].my_dialogs,chatPriority:user[0].chatPriority,name:user[0].name,surname:user[0].surname,friends:user[0].friends})
    }catch(e){
        res.code(400).send({erorr:"Что-то пошло не так"})
    }
    })

    router.post("/user/find",async(req,res)=>{
        const body = req.body
        const query = body.find.split(" ")
        try{
            if(query.length === 2){
                let user = await User.find({
                    "name":{$regex:new RegExp(query[0], "i")},"surname":new RegExp(query[1], "i")})
                    .select("name surname")
                res.send(user)
            }
            else{
                let user = await User.find({
                    "name":{$regex:new RegExp(query[0], "i")}})
                    .select("name surname")
                res.send(user)
            }
        }catch(e){
            res.status(404).send({})
        }
    })


module.exports = router