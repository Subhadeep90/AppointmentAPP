const sequelize = require('../util/database');
const UploadedContent=require('../Model/UploadedContent')
const AWS=require('aws-sdk');
const userexpense=require('../Model/expenseuser');

require('dotenv').config();

const express=require('express');
function uploadToS3(data,filename)
{
  const BUCKET_NAME=process.env.BUCKET_Name;
  const IAM_USER_KEY=process.env.IAM_User_Key;
  const IAM_USER_SECRET=process.env.IAM_Secret_Key;
  let s3Bucket= new AWS.S3({
      accessKeyId:IAM_USER_KEY,
      secretAccessKey:IAM_USER_SECRET
  })
   var params={
       Bucket:BUCKET_NAME,
       Key:filename,
       Body:data,
       ACL:'public-read'
   }
   return new Promise((resolve,reject)=>{
    s3Bucket.upload(params,(err,s3response)=>{
        if(err)
        {
            console.log('Something went wrong')
            reject(error)
        }else{
            console.log('Success',s3response)
            resolve(s3response.Location);
         }
       
     })
   })
  


}


const DownloadListoffiles=async(req,res)=>{
    try{
       const cUploaded= await UploadedContent.findAll({
            where:{
                Userid:req.user.id
            }
        })
     res.status(200).json({success:true,message:'Successfull',data:cUploaded})
    }
    catch(error){
        console.log(error)
    }
}


const getDownload=async(req,res)=>{
    try{
        const Expense=await userexpense.findAll({
        where:{ExpenseuserdetailId:req.user.id} 
    })
    const userid=req.user.id;
    const stringifiedExpense=JSON.stringify(Expense)
    const filename=`expenses${userid}/${new Date()}.txt`
    const fileUrl=await uploadToS3(stringifiedExpense,filename)
    console.log(fileUrl)
    await UploadedContent.create({
        Userid:req.user.id,
        FileUrl:fileUrl
    })
    
    res.status(200).json({fileUrl,success:true})
    
}
catch(error){
    console.log(error)
    res.status(400).json({message:'Something went wrong'})
}
}
module.exports={
    DownloadListoffiles,
    getDownload
}