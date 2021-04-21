const jwt = require("jsonwebtoken")
const config = require("../../config.json")
const User = require('../../models/User')
const express = require('express');
const router = express.Router();

router.get("/invitations",async (req,res)=>{
    const {token} = req.cookies
    try{
    const jwtToken = jwt.verify(token,config.jwt)
    const user = await User.findById({_id:jwtToken.id}).select("invitesFrom invitesTo").populate({path:"invitesFrom",select:"name surname _id"}).lean()
    res.send({invitesFrom:user.invitesFrom,invitesTo:user.invitesTo})
    }catch(e){
        res.status(400).send("Что-то пошло не так")
 }
})

module.exports = router