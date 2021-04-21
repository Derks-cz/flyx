const User = require('../../models/User')
const Message = require('../../models/Message')
const config = require("../../config.json")
const jwt = require("jsonwebtoken")
const express = require('express');
const router = express.Router();
router.get("/chat/chatId",async (req,res)=>{
    let {id} = req.query
    try{
        let message = await Message.findOne({chatId:id}).lean()
        if(message){
            res.send(message.messages)
        }
        else{
            res.status(404).send(false)
        }
    } catch(e){
        res.status(404).send([])
    }
})
router.get("/chat/user",async (req,res)=>{
    const {id} = req.query
    try{
   
        const candidate = await User.findById({_id:id}).select("name surname chatPriority").lean()
        if(candidate){
            res.send({name:candidate.name,surname:candidate.surname,chatPriority:candidate.chatPriority})
        }
        else{
            res.status(404).send([])
        }
    }catch(e){
        console.log(e)
        res.status(404).send([])
    }
})
 router.post("/chat/add/dialogs",async (req,res)=>{
    let cookie = req.cookies
    let {id} = req.body
    try{
        const candidate = await User.findById({_id:id}).select("dialogs")
        const jwtToken = jwt.verify(cookie.token,config.jwt)
        const user = await User.findById({_id:jwtToken.id}).select("dialogs")

        if(candidate && user){
            candidate.dialogs.forEach(val=>{
                if(val.toString() !== jwtToken.id){
                     candidate.dialogs.push(jwtToken.id)
                }
            })
            user.dialogs.forEach(val=>{
                if(val.toString() !== id){
                    user.dialogs.push(id)
                }
            })
            if(!user.dialogs.length && !candidate.dialogs.length){
                user.dialogs.push(id)
                candidate.dialogs.push(jwtToken.id)
            }
            await Promise.all([user.save(),candidate.save()])
            res.send(Math.random().toString())
        }
    }catch(e){
        console.log(e)
        res.status(400).send([])
    }
 })

module.exports = router