const cors=require('cors');
const express=require('express');
const path=require('path');
const app=express();
const expenserouter=require('./Routes/expenseuser')
const sequelize=require('./Model/Expense');
const bodyparser=require('body-parser'); 
const { AsyncResource } = require('async_hooks');
const expensedetails = require('./Model/Expense');
const { where } = require('sequelize');
app.use(bodyparser.json({extended:false}));
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));
 
app.use(expenserouter)
sequelize.sync().then((result)=>{
    app.listen(5000)

}).catch((error)=>{
console.log(error)
});