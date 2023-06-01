const cors=require('cors');
const express=require('express');
const app=express();
const path=require('path');
app.use(cors());
const bodyparser=require('body-parser'); 
const { AsyncResource } = require('async_hooks');
const sequelize=require('./Model/expenselogin');
const bcrypt=require('bcrypt')
const { where } = require('sequelize');
app.use(bodyparser.json({extended:false}));
app.use('/user/Login',async(req,res)=>{
console.log(req.body)
const Emailid=req.body.Email;
const UserPassword=req.body.Password;
if(Emailid=="" || UserPassword=="")
{
res.status(400).json({message:"Email or Password is missing"})
}
else{
    try{
       const user=await sequelize.findAll({
    where:{Email:Emailid}})

if(user.length>0)
{
    bcrypt.compare(UserPassword,user[0].Password,(err,result)=>{
        if(err)
        {
            throw new Error("Something went wrong")
        }
        if(result===true)
        {
        res.status(200).json({message:"User logged in sucessful"})
        }
    
    

    else
    {
    res.status(401).json({message:"Wrong Password"})
    }
})
}
else{
    return res.status(404).json({message:"User not found"})
}
}

catch(error){
res.status(505).json({message:"Something went wrong"})
}

}
})
app.use('/user/Signup',async(req,res)=>{
if(req.body.Name==""||req.body.Email==""||req.body.Password=="")
{
    res.status(400).json({message:"Name or Email or Password is missing"})
}
else{
try{
    const Passwordtaken=req.body.Password;
    const saltrounds=10;
    bcrypt.hash(Passwordtaken,saltrounds,async(error,hash)=>{
        console.log(error)
        await sequelize.create({
            Name:req.body.Name,
            Email:req.body.Email,
            Password:hash
        
        })
    })

    
}

catch(error){
console.log(error)
res.send('User Already Exists') 
}
}
})
sequelize.sync().then((result)=>{
    app.listen(3000)
}).then((error)=>{
    console.log(error)
});


