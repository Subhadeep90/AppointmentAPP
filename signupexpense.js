const cors=require('cors');
const express=require('express');
const app=express();
const path=require('path');
app.use(cors());
const bodyparser=require('body-parser'); 
const { AsyncResource } = require('async_hooks');
const sequelize=require('./Model/expenselogin');
const userexpense=require('./Model/expenseuser');
const userauthentication=require('./middleware/auth')

const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken')
const { where } = require('sequelize');
const { generateKeyPair } = require('crypto');
app.use(bodyparser.json({extended:false}));
app.delete('/user/expense/deleteexpense/:id',userauthentication,(req,res)=>{
    
    userexpense.destroy({where:{
        ExpenseuserdetailId:req.user.id,
        id:req.params.id

    }
    })
    .then((result)=>{
        console.log(result)
        if(result==0)
        {
            res.status(400).json({message:"User Authentication failed"})
        }
    })
    .catch((error)=>{
     console.log(error)
    })
})
app.get('/user/expense/getexpense',userauthentication,(req,res)=>{
 userexpense.findAll({
     where:{
        ExpenseuserdetailId:req.user.id  
     }
 })
 .then((result)=>{
     res.status(200).json({result})
 })
 .catch((error)=>{
     console.log(error)
 })
})


app.post('/user/expense/addexpense',userauthentication,(req,res)=>{
console.log(req.body)
userexpense.create({
    Expenditure:req.body.Expenditure,
    Description:req.body.Description,
    Category:req.body.Category,
    ExpenseuserdetailId:req.user.id

})
.then((result)=>{
    res.status(200).json({result})
})
.catch((error)=>{
    console.log(error)
})
})
function generateAccessToken(id)
{
    return jwt.sign({userid:id},'98ABCD45677')
}
app.post('/user/Login',async(req,res)=>{
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

        res.status(200).json({Name:user[0].Name,message:"User logged in sucessful",token:generateAccessToken(user[0].id)})
        
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

sequelize.hasMany(userexpense);
userexpense.belongsTo(sequelize)


sequelize.sync().then((result)=>{
    userexpense.sync().then((result)=>{
        app.listen(3000)

    }).catch((error)=>{
        console.log(error)
    });
}).catch((error)=>{
    console.log(error)
});


