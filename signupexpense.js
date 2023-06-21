require('dotenv').config();
const cors=require('cors');
const express=require('express');
const app=express();
const path=require('path');
app.use(cors());
const bodyparser=require('body-parser'); 
const { AsyncResource } = require('async_hooks');
const expenseuserdetails=require('./Model/expenselogin');
const userexpense=require('./Model/expenseuser');
const ordercreated=require('./Model/order');
const SIB=require('sib-api-v3-sdk')

const userauthentication=require('./middleware/auth')
const Razorpay=require('razorpay')
const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken');
const sequelize = require('./util/database');
const { Transaction } = require('sequelize');
const { getMaxListeners } = require('process');
//const { where, expenseuserdetails } = require('expenseuserdetails');
//const { generateKeyPair } = require('crypto');
//const { expenseuserdetailsMethod } = require('expenseuserdetails/types/utils');
function generateAccessToken(id,ispremiumuser)
{
    return jwt.sign({userid:id,ispremiumuser},process.env.Token_key)
}
app.use(bodyparser.json({extended:false}));


app.delete('/user/expense/deleteexpense/:id',userauthentication,async(req,res)=>{
const t=await sequelize.transaction();
console.log(req.body.Expense)
    try{
    

    const expense=await userexpense.destroy({
        where:{
        ExpenseuserdetailId:req.user.id,
        id:req.params.id

    },transaction:t
}) 
     const totalExpenses=Number(req.user.TotalExpense)-Number(req.body.Expense)
     const updateUpdatedetails=await expenseuserdetails.update(
        {TotalExpense:totalExpenses}
    ,{
        where:{id:req.user.id},
        transaction:t
    });
    (await t).commit()
   
    res.status(200).json({updateUpdatedetails}) 
    }
    catch(error){
     console.log(error)
     (await t).rollback();
res.status(400).json({message:"User Authentication failed"})
    }
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
app.post('/user/expense/addexpense',userauthentication,async(req,res)=>{
     const t=await sequelize.transaction();
try{
    await userexpense.create({
    Expenditure:req.body.Expenditure,
    Description:req.body.Description,
    Category:req.body.Category,
    ExpenseuserdetailId:req.user.id

},{ transaction:t
})


  
const totalExpenses=Number(req.user.TotalExpense) +Number(req.body.Expenditure)

      console.log(totalExpenses)
 const updateUpdatedetails=await expenseuserdetails.update(
     {TotalExpense:totalExpenses}
 ,{
     where:{id:req.user.id},
     transaction:t
 });
 (await t).commit()

 res.status(200).json({updateUpdatedetails}) 
}
  

catch(error){
(await t).rollback();
    console.log(error)
    res.status(400).json({message:"User Authentication failed"})

}

// const totalExpenses=Number(user.TotalExpense)+req.body.Expenditure
// const userupdated=await expenseuserdetails.update({
//         TotalExpense:totalExpenses
//     },{
//         where:{
//             id:req.user.id
//         }       
//     }
//     )
}
)
    

    


app.get('/user/buypremium',userauthentication,async(req,res)=>{
try{
const razorpay=new Razorpay({
key_id:process.env.RAZORPAY_KEY_ID,
key_secret:process.env.RAZORPAY_KEY_SECRET

})
const amount=2500
razorpay.orders.create({amount,currency:"INR"},(err,order)=>{
if(err)
 {
console.log(err)
}
ordercreated.create({orderid:order.id,status:'PENDING',ExpenseuserdetailId:req.user.id}).then(()=>{
 return res.status(201).json({order,key_id:razorpay.key_id})
 })
.catch((err)=>
 {
 throw new Error(err)
}
)
})
}
catch(error)
{
    console.log(error)
    res.status(403).json({message:'Something went wrong',error:error})
}
})


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
       const user=await expenseuserdetails.findAll({
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
        res.status(200).json({Name:user[0].Name,message:"User logged in sucessful",token:generateAccessToken(user[0].id,user[0].ispremiumuser)})
        
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
        await expenseuserdetails.create({
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
app.post('/purchase/updatetransactionstatus',async(req,res)=>{
    try{
    const order= await ordercreated.findOne({
    where:{
        orderid:req.body.order_id
    }
})
    if(req.body.error!=null)
    {
        await order.update({
            paymentid:req.body.payment_id,
        status:'Failed'
        })
    }

        


    
    else{
    const promise1=await order.update({
        paymentid:req.body.payment_id,
        
        status:'Successful'
    })
      const promise2 = await expenseuserdetails.findOne({
           where:{
               id:promise1.ExpenseuserdetailId
           }
       })
        await promise2.update({
            ispremiumuser:true
        })
     Promise.all([promise1,promise2])
     res.status(200).json({message:'Successful',token:generateAccessToken(promise1.ExpenseuserdetailId,true)})
}
} 
catch(error){
            console.log(error)
        }

    })   
app.get('/premiumuser/leaderboard',async(req,res)=>{
    try{

    const leaderboardusers=await expenseuserdetails.findAll({
        // attributes:['Name','id',[sequelize.fn('SUM',sequelize.col('userexpenses.Expenditure')),'totalcost']],
        // include:[
        //     {
        //      model:userexpense,
        //      attributes:[]
        //     }
        // ],
        // group:['expenseuserdetails.id'],
        order:[['TotalExpense','DESC']]
    })

    res.status(200).json(leaderboardusers)

}
catch(error)
{
    console.log(error)
}
})
app.use('/user/password/forgotpassword',(req,res)=>{
    console.log(req.body)
    if(req.body.mailid=="")
    {  
       res.status(405).json({message:'Please Enter mailid' })
    }
    else{
        const client=SIB.ApiClient.instance
const apiKey=client.authentications['api-key']
apiKey.apiKey=process.env.Api_key
const tranEmailApi=new SIB.TransactionalEmailsApi()
const sender={
    email:'subhadeepmitra1990@gmail.com'
}
const receivers=[
    {
        email:req.body.mailid
    }
]
tranEmailApi.sendTransacEmail({
sender,
to:receivers,
subject:'Your Passwrd',
textContent:'sm@gmail.com'
})
    .then((resolve)=>{
    console.log(resolve)
}).catch((error)=>{
    console.log(error)
})
    res.status(200).json({message:'Submitted Successfully'})
    }
})
expenseuserdetails.hasMany(userexpense)
userexpense.belongsTo(expenseuserdetails)
expenseuserdetails.hasMany(ordercreated)
ordercreated.belongsTo(expenseuserdetails)
expenseuserdetails.sync().then((result)=>{
    userexpense.sync().then((result)=>{
         ordercreated.sync().then((result)=>{
            app.listen(3000);
           
        }).catch((error)=>{
            console.log(error)
         })
    }).catch((error)=>{
        console.log(error)
    });
}).catch((error)=>{
    console.log(error)
});


