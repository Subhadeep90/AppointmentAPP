const cors=require('cors');
const express=require('express');
const app=express();
const path=require('path');
app.use(cors());
const bodyparser=require('body-parser'); 
const { AsyncResource } = require('async_hooks');
app.use(bodyparser.json({extended:false}));
const sequelize=require('./Model/shopmodel')
const shoproutes=require('./Routes/shoproutes')
app.use('/',shoproutes);




sequelize.sync().then((result)=>{
    app.listen(5000)

}).catch((error)=>{
console.log(error)
});


