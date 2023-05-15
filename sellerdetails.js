const cors=require('cors');
const express=require('express');
const app=express();
const path=require('path');
const sequelize=require('./Model/sellermodel');
app.use(cors());
const bodyparser=require('body-parser'); 
const { AsyncResource } = require('async_hooks');
app.use(bodyparser.json({extended:false}));
//const sellerroutes=require('./Routes/sellerroutes')
app.delete('/submitsellerdetails/deleteItems/:id',async(req,res,next)=>{
    try{
        const sellerdetails=await sequelize.destroy({where:{
        id:req.params.id
    }})
}
catch(error)
{
    console.log(error)
}
    })
    app.get('/submitsellerdetails/getdetails',async(req,res,next)=>{
        try{
        const getsellerdetails=await sequelize.findAll()
        res.json({getsellerdetails})
    }
    catch(error){
       console.log(error)
    }    
});

app.post('/submitsellerdetails',async(req,res,next)=>{
try{
    const sellerdetails=await sequelize.create({
    SellingPrice:req.body.SellingPrice,
    ProductName:req.body.Item,
    Category:req.body.Category
})
res.json({sellerdetails})
}
catch(error)
{
    console.log(error)
}
})

sequelize.sync().then((result)=>{
    app.listen(5000)

}).catch((error)=>{
console.log(error)
});



