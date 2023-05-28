const cors=require('cors');
const express=require('express');
const app=express();
const path=require('path');
app.use(cors());
const bodyparser=require('body-parser'); 
const { AsyncResource } = require('async_hooks');
const sequelize=require('./Model/expenselogin')
app.use(bodyparser.json({extended:false}));
app.use('/user/Login',async(req,res)=>{
res.sendStatus(200);
})

app.use('/user/Signup',async(req,res)=>{
try{
    await sequelize.create({
    Name:req.body.Name,
    Email:req.body.Email,
    Password:req.body.Password

})
}

catch(error){
console.log(error)
res.send('User Already Exists') 
}
})
sequelize.sync().then((result)=>{
    app.listen(3000)
}).then((error)=>{
    console.log(error)
});


