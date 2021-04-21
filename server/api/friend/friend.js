const e = require('express');
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")
const config = require("../../config.json")
const User = require("../../models/User")

    router.post("/friend/invite",async (req,res)=>{
        const {token} = req.cookies
        const {userID} = req.body
        const io = req.app.get("socketio")
        try{
            let isFoundInvitesTo = false
            let isFoundInvitesFrom = false
            let error = false
            const {id} = jwt.verify(token,config.jwt)
            const user = await User.findById({_id:id}).select('invitesTo friend')
            const invitesToUser = await User.findById({_id:userID}).select('invitesFrom')
    
            user.friend.forEach(i=>{
                if(i.toString() === userID || id === i.toString()){
                    error = true
                }
            })
            if(user.invitesTo.length){
            user.invitesTo.forEach((i)=>{
                if(userID === i.toString()){
                    isFoundInvitesTo = true
                }
            })
            }
            if(invitesToUser.invitesFrom.length){
                invitesToUser.invitesFrom.forEach(value=>{
                    if(value.toString() === id){
                        isFoundInvitesFrom = true
                    }
                })
            }
            if(!isFoundInvitesTo && !isFoundInvitesFrom && !error){
                user.invitesTo.push(userID)
                invitesToUser.invitesFrom.push(id)
                await Promise.all([user.save(),invitesToUser.save()])
                io.of("/notification").to(userID).emit("invite",Math.random().toString())
                res.send({ok:true,newInvite:Math.random().toString()})
            }
            else res.status(400).send({ok:false})
            
        }catch(e){
            console.log(e)
            res.status(400).send({ok:false})
        }
    })
    router.post("/friend/remove",async(req,res)=>{
        const {token} = req.cookies
        const {userID} = req.body
        const io = req.app.get("socketio")
        try{
            const {id} = jwt.verify(token,config.jwt)
            const user = await User.findById({_id:id}).select("friend")
            const candidate = await User.findById({_id:userID}).select("friend")
            user.friend.forEach((el,i)=>{
                if(el.toString() === userID){
                    user.friend.splice(i,1)
                }
            })
            candidate.friend.forEach((el,i)=>{
                if(el.toString() === id){
                    candidate.friend.splice(i,1)
                }
            })
            await Promise.all([user.save(),candidate.save()])
            io.of("/notification").to(userID).emit("remove_friend",Math.random().toString())
            io.of("/notification").to(id).emit("remove_friend",Math.random().toString())
            res.send({})
        }catch(e){
            res.status(400).send({})
        }
    })
    router.post("/friend/invite/accept",async (req,res)=>{
        const {token} = req.cookies
        const body = req.body
        const io = req.app.get("socketio")
        try{
            const {id} = jwt.verify(token,config.jwt)
            const user = await User.findById({_id:id}).select("invitesFrom friend")
            const candidate = await User.findById({_id:body.id}).select("invitesTo friend")
            user.invitesFrom.forEach((val,i)=>{
                if(val.toString() === body.id){
                    user.invitesFrom.splice(i,1)
                }
            })
            candidate.invitesTo.forEach((val,i)=>{
                if(val.toString() === id){
                    candidate.invitesTo.splice(i,1)
                }
            })
            if(!user.friend.includes(body.id)){
                user.friend.push(body.id)
            }
            if(!candidate.friend.includes(id)){
                 candidate.friend.push(id)
            }
            await Promise.all([user.save(),candidate.save()])
            io.of("/notification").to(body.id).emit("invite",Math.random().toString())
            io.of("/notification").to(id).emit("invite",Math.random().toString())
            res.send(Math.random().toString())
        }catch(e){
            res.status(400).send("Что-то пошло не так")
        }
    })

    router.post("/friend/invite/reject",async (req,res)=>{
        const {token} = req.cookies
        const body = req.body
        const io = req.app.get("socketio")
        try{
            const {id} = jwt.verify(token,config.jwt)
            const user = await User.findById({_id:id}).select("invitesFrom")
            const candidate = await User.findById({_id:body.id}).select("invitesTo")
            user.invitesFrom.forEach((val,i)=>{
                if(val.toString() === body.id){
                    user.invitesFrom.splice(i,1)
                }
            })
            candidate.invitesTo.forEach((val,i)=>{
                if(val.toString() === id){
                    candidate.invitesTo.splice(i,1)
                }
            })
            await Promise.all([user.save(),candidate.save()])
            io.of("/notification").to(body.id).emit("invite",Math.random().toString())
            res.send(Math.random().toString())
       
        }catch(e){
            res.status(400).send("Что-то пошло не так")
        }
    })

module.exports = router