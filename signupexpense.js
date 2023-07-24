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
const userrouter=require('./Routes/expenseuserroutes')
const purchaseroutes=require('./Routes/expensepurchaseroutes')
const updatepasswordroutes=require('./Routes/expenseupdatepassword')
const downloadfilesroutes=require('./Routes/expensedownloadfiles')



const sequelize = require('./util/database');
const passwordrequest = require('./Model/passwordrequestable');
const { error } = require('console');
//const { where, expenseuserdetails } = require('expenseuserdetails');
//const { generateKeyPair } = require('crypto');
//const { expenseuserdetailsMethod } = require('expenseuserdetails/types/utils');
const accesslog=fs.createWriteStream(path.join(__dirname,'access.log'),{
    flags:'a'
});
app.use(bodyparser.json({extended:false}));
app.use(helmet());
app.use(morgan('combined',{stream:accesslog}));


app.use(userrouter)
app.use(purchaseroutes)
app.use(updatepasswordroutes)
app.use(downloadfilesroutes)




    

app.use(updatepasswordroutes)

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


