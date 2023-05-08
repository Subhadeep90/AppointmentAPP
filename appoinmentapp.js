const cors=require('cors');
const express=require('express');
const app=express();
const path=require('path');
const sequelize=require('./Model/usermodel');
app.use(cors());
const bodyparser=require('body-parser'); 
const { AsyncResource } = require('async_hooks');
app.use(bodyparser.json({extended:false}));
const userroutes=require('./Routes/user')
app.use('/',userroutes.module)

sequelize.sync().then((result)=>{
    app.listen(5000)

}).catch((error)=>{
console.log(error)
});



