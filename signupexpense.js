const cors=require('cors');
const express=require('express');
const app=express();
const path=require('path');
app.use(cors());
const bodyparser=require('body-parser'); 
const { AsyncResource } = require('async_hooks');
app.use(bodyparser.json({extended:false}));


// app.use('/user',(req,res)=>{

// })

app.listen(3000);


