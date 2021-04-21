
const express = require('express');
const router = express.Router();
const config = require("../../config.json")
const User = require('../../models/User')
const Ajv = require("ajv").default
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const ajv = new Ajv({allErrors: true})
const schema ={
    "type":"object",
    "required": ['email',"password","name","surname","day","month","year"],
    "properties":{
        "email":{type:"string",pattern:"^(([^<>()[\\]\\.,;:\\s@\"]+(\\.[^<>()[\\]\\.,;:\\s@\"]+)*)|(\".+\"))@(([^<>()[\\]\\.,;:\\s@\"]+\\.)+[^<>()[\\]\\.,;:\\s@\"]{2,})$"},
        "password":{type:"string",minLength:7},
        "name":{type:"string",minLength:2,maxLength:13,pattern:"^[А-Я][а-я]{0,}[^А-Я]"},
        "surname":{type:"string",minLength:4,maxLength:13,pattern:"^[А-Я][а-я]{0,}[^А-Я]"},
        "day":{type:"integer",minimum:1,maximum:31},
        "month":{type:"string"},
        "year":{type:"integer",minimum:1930,maximum:2016}
    }
}
    router.post("/register",async (req,res)=>{
        const body = req.body
        body.day = parseInt(body.day)
        body.year = parseInt(body.year)
        try{
            const validate = ajv.compile(schema)
            const valid = validate(body)
            if(validate.errors){
                if(validate.errors.length >= 1){
                    let validationError = validate.errors[0]
                    switch(validationError.dataPath){
                        case "/name":
                            res.status(400).send("Имя должно быть из 2 и более букв")
                            break;
                        case "/email":
                            res.status(400).send("Некорректный формат почты")
                            break;
                        case "/password":
                            res.status(400).send("Минимальная длина пароля 7 символов")
                            break;
                        case "/surname":
                            res.status(400).send("Минимальная длина фамилии 4 буквы")
                            break;
                        case "/day":
                            res.status(400).send("День должен быть от 1 до 31")
                            break;
                        case "/year":
                            res.status(400).send("Укажите год от 1930 до 2015")
                            break;
                        default:
                            res.status(400).send("Что-то пошло не так")
                            break;
                    }
                }
            }
            
            const bpassword = await bcrypt.hash(body.password,7)
            const user = new User({email:body.email,password:bpassword,name:body.name,surname:body.surname,brithday:{day:body.day,month:body.month,year:body.year}})
            await user.save()
            res.send("Пользователь создан")
            
        }catch(e){
            console.log(e)
            res.send("Что-то пошло не так")
        }
    })
    router.post("/login",async (req,res)=>{
        const {email,password} = req.body
        try{
            const user = await User.findOne({email}).lean()
            if(!user){
                res.send({error:`Пользователь с почтой ${email} не найден`})
            }
            else{
               let pass = await bcrypt.compare(password,user.password)
                if(pass){
                    const jwtToken = jwt.sign({id:user._id},config.jwt)
                    res.cookie("token", jwtToken, { httpOnly: true }).send({login:true,error:null})
                    
                }
                else {
                    res.status(400).send({error:"Неверная почта или пароль"})
                }
            }
        }catch(e){
            res.status(400).send({error:"Error"})
            console.log(e)
        }
    })
    router.post("/isAuth",async (req,res)=>{
        const {token} = req.cookies
        try{
            const jwtToken = jwt.verify(token,config.jwt)      
            res.send({isAuth:true,id:jwtToken.id})
        }catch(e){
            res.status(400).send({isAuth:false,id:""})
        }
    })
    router.post("/logOut",(req,res)=>{
        res.clearCookie('token').send({isAuth:false,id:""})
    })
   

module.exports = router