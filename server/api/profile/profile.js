const User = require('../../models/User')
const mongoose = require("mongoose")
const express = require('express');
const router = express.Router();
    router.get("/profile",async (req,res)=>{
        const {id} = req.query
        try{
            if(id !== undefined || null ){
            const user = await User.aggregate([
                {
                    "$match":{
                        "_id": mongoose.Types.ObjectId(id)
                    }},
                    {
                    "$lookup":{
                        "from":"users",
                        "localField":"friend",
                        "foreignField":"_id",
                        "as":"friends"
                    }
                },
                {"$project":{"friends.password":0,"friends.email":0,"friends.friend":0,"friends.blackList":0,"friends.dialogs":0,"friends.invitesTo":0,"friends.invitesFrom":0}}
            ])
            
            if(user){
            res.send({found:true,id:user[0]._id,name:user[0].name,surname:user[0].surname,
                friends:user[0].friends,
                brithday:{day:user[0].brithday.day,month:user[0].brithday.month,year:user[0].brithday.year}

            })
            }
            else res.code(404).send({found:false})
        }
        }
        catch(e){
            res.code(400).send({found:false})
        }
    })


module.exports = router