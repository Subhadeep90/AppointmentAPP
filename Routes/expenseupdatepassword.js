// const sequelize = require('../util/database');

const userauthentication=require('../middleware/auth')
const express=require('express');
const router=express.Router()
 const updatePasswordController=require('../Controllers/expenseupdatePasswordcontroller')


router.get('/updatepassword/:id',updatePasswordController.getupdatepassword)

router.use('/password/resetpassword/:id',updatePasswordController.resetPassword)
// function uploadToS3(data,filename)
// {
//   const BUCKET_NAME=process.env.BUCKET_Name;
//   const IAM_USER_KEY=process.env.IAM_User_Key;
//   const IAM_USER_SECRET=process.env.IAM_Secret_Key;
//   let s3Bucket= new AWS.S3({
//       accessKeyId:IAM_USER_KEY,
//       secretAccessKey:IAM_USER_SECRET
//   })
//    var params={
//        Bucket:BUCKET_NAME,
//        Key:filename,
//        Body:data,
//        ACL:'public-read'
//    }
//    return new Promise((resolve,reject)=>{
//     s3Bucket.upload(params,(err,s3response)=>{
//         if(err)
//         {
//             console.log('Something went wrong')
//             reject(error)
//         }else{
//             console.log('Success',s3response)
//             resolve(s3response.Location);
//          }
       
//      })
//    })
  


// }
 router.use('/user/password/forgotpassword',updatePasswordController.forgotpassword)

module.exports=router;
