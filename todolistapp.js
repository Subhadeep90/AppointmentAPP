const cors=require('cors');
const express=require('express');
const app=express();
app.use(cors());
const bodyparser=require('body-parser'); 
const { AsyncResource } = require('async_hooks');
app.use(bodyparser.json({extended:false}));
const sequelize=require('./Model/todolist');
const todorouter=require('./Routes/todolistroutes')
app.use(todorouter)
sequelize.sync().then((result)=>{
    app.listen(5000)

}).catch((error)=>{
console.log(error)
});


