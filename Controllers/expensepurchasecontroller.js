const sequelize = require('../util/database');
require('dotenv').config();

const express=require('express');
const router=express.Router()
const expenseuserdetails=require('../Model/expenselogin');
const ordercreated=require('../Model/order');


const updatetransaction=async(req,res)=>{
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

    }  
    

const PremiumUserLeaderboard=async(req,res)=>{
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
}

module.exports={
    updatetransaction,
    PremiumUserLeaderboard
}