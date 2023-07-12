const sequelize = require('../util/database');
const forgotpasswordrequest=require('../Model/passwordrequestable')
const SIB=require('sib-api-v3-sdk')
const expenseuserdetails=require('../Model/expenselogin');
require('dotenv').config();

const userauthentication=require('../middleware/auth')
const express=require('express');
const uuid=require('uuid');
const AWS=require('aws-sdk');
const bcrypt=require('bcryptjs')

const getupdatepassword=async(req,res)=>{ 
    try{
        const id=req.params.id
        const updatedPassword=req.query.updatedpassword
        const saltrounds=Number(process.env.SALTROUNDS);
    const hash= await bcrypt.hash(updatedPassword,saltrounds)
    const userupdate=await forgotpasswordrequest.findOne({
        where:{
            id:id
        }
    })
    console.log(id)
     await forgotpasswordrequest.update({
         isActive:false
     },{
         where:{
             id:id
         }
     })
     await expenseuserdetails.update({
         Password:hash
     },{
         where:{
             id:userupdate.dataValues.userId
         }
     })
     res.status(200).json({message:'Password Updated Successfully'})

    }
    catch(error)
    {
        console.log(error)
        res.status(400).json({message:'Something went wrong'})
    }
    }

const resetPassword=(req,res)=>{
const id=req.params.id;
forgotpasswordrequest.findOne({
    where:{
        id:req.params.id
    }
}).then((result)=>{
 if(result && result.dataValues.isActive==true)
 {
   res.status(200).send(`<form method="GET" action="/updatepassword/${id}">New Password<input type="password" name="updatedpassword" id="mailid"><button type="submit" id="submit">Reset Password</button</form>`)
 }
}).catch((error)=>{
    console.log(error)
})
}
const forgotpassword=(req,res)=>{
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
    email:process.env.EMAILID
}
const receivers=[
    {
        email:req.body.mailid
    }
]
const newid=uuid.v4()
expenseuserdetails.findOne({
    where:{
        email:req.body.mailid
    }
}).then((user)=>{
    const userID=user.dataValues.id

   if(!user)
   {
       res.status(400).json({message:'No such user'})
   }
else{
    forgotpasswordrequest.create({
        id:newid,
        isActive:true,
        userId:userID
    
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
}
}).catch((error)=>{
   console.log(error)
})

tranEmailApi.sendTransacEmail({
sender,
to:receivers,
subject:'Your Password reset link',
textContent:`http://54.161.203.137:3000/password/resetpassword/${newid}`
})
    .then((resolve)=>{
    console.log(resolve)
    res.status(200).json({message:'Please click on the link sent in your mail to reset password'})

}).catch((error)=>{
    console.log(error)
})
    }
}

module.exports={
    getupdatepassword,
    resetPassword,
    forgotpassword
};


