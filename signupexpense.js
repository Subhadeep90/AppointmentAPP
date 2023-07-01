require('dotenv').config();
const cors=require('cors');
const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs')
app.use(cors());
const bodyparser=require('body-parser'); 
const { AsyncResource } = require('async_hooks');
const expenseuserdetails=require('./Model/expenselogin');
const userexpense=require('./Model/expenseuser');
const ordercreated=require('./Model/order');
const SIB=require('sib-api-v3-sdk')
const forgotpasswordrequest=require('./Model/passwordrequestable')
const UploadedContent=require('./Model/UploadedContent')
const helmet=require('helmet')
const morgan=require('morgan')

const userauthentication=require('./middleware/auth')
const Razorpay=require('razorpay')
const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken');
const sequelize = require('./util/database');
const { Transaction } = require('sequelize');
const { getMaxListeners } = require('process');
const passwordrequest = require('./Model/passwordrequestable');
const uuid=require('uuid');
const AWS=require('aws-sdk');
const { error } = require('console');
//const { where, expenseuserdetails } = require('expenseuserdetails');
//const { generateKeyPair } = require('crypto');
//const { expenseuserdetailsMethod } = require('expenseuserdetails/types/utils');
function generateAccessToken(id,ispremiumuser)
{
    return jwt.sign({userid:id,ispremiumuser},process.env.Token_key)
}
const accesslog=fs.createWriteStream(path.join(__dirname,'access.log'),{
    flags:'a'
});
app.use(bodyparser.json({extended:false}));
app.use(helmet());
app.use(morgan('combined',{stream:accesslog}));


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
    const Item_per_page=Number(req.query.nor);
    console.log(Item_per_page)
    console.log(req.query)
    let page=Number(req.query.page)
    userexpense.findAll({
      where:{ExpenseuserdetailId:req.user.id}  
    }).then((expense)=>{
       let totalItems;
        totalItems=expense.length


    return userexpense.findAll({
     where:{
        ExpenseuserdetailId:req.user.id

     }
     ,offset:(page-1)*Item_per_page,
     limit:Item_per_page
    })
 .then((result)=>{
     res.status(200).json({result,
         previousPage:page-1,currentPage:page,nextPage:page+1,hasNextPage:Item_per_page*page<totalItems,hasPreviousPage:page>1,lastPage:Math.ceil(totalItems/Item_per_page)})
 })
 .catch((error)=>{
     console.log(error)
 })
})
})
app.post('/user/expense/dynamicpagination',(req,res)=>{
    const norNumber=req.body.nor
    res.status(200).json({message:'successful',norNumber:norNumber})
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
    const saltrounds=process.env.SALTROUNDS;
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
app.get('/updatepassword/:id',async(req,res)=>{
    try{
        const id=req.params.id
        const updatedPassword=req.query.updatedpassword
        const saltrounds=process.env.SALTROUNDS;
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
     res.status(200).send('Password updated successfully') 
    }
    catch(error)
    {
        console.log(error)
        res.status(400).json({message:'Something went wrong'})
    }
    })

app.use('/password/resetpassword/:id',(req,res)=>{
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
})
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
app.get('/user/premiumuser/download/listoffiles',userauthentication,async(req,res)=>{
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
})


app.get('/user/premiumuser/download',userauthentication,async(req,res)=>{
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
textContent:`http://localhost:3000/password/resetpassword/${newid}`
})
    .then((resolve)=>{
    console.log(resolve)
}).catch((error)=>{
    console.log(error)
})
    res.status(200).json({message:'Please click on the link sent in your mail to reset password'})
    }
})

expenseuserdetails.hasMany(userexpense)
userexpense.belongsTo(expenseuserdetails)
expenseuserdetails.hasMany(ordercreated)
ordercreated.belongsTo(expenseuserdetails)
expenseuserdetails.hasMany(forgotpasswordrequest)
forgotpasswordrequest.belongsTo(expenseuserdetails)
expenseuserdetails.sync().then((result)=>{
    userexpense.sync().then((result)=>{
         ordercreated.sync().then((result)=>{
         forgotpasswordrequest.sync().then((result)=>{
             UploadedContent.sync().then((result)=>{
                app.listen(process.env.PORT)

             })
         })
           
        }).catch((error)=>{
            console.log(error)
         })
    }).catch((error)=>{
        console.log(error)
    });
}).catch((error)=>{
    console.log(error)
});


