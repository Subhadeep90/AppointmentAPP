require('dotenv').config();
const { getMaxListeners } = require('process');

const sequelize = require('../util/database');

const express=require('express');
const router=express.Router()
const { Transaction } = require('sequelize');
const Razorpay=require('razorpay')

const expenseuserdetails=require('../Model/expenselogin');
const userexpense=require('../Model/expenseuser');
const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken');
const ordercreated=require('../Model/order');


function generateAccessToken(id,ispremiumuser)
{
    return jwt.sign({userid:id,ispremiumuser},process.env.Token_key)
}



const deleteuserexpense=async(req,res)=>{
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
    }
    const getExpense=(req,res)=>{
        const Item_per_page=Number(req.query.nor);
        
        let page=Number(req.query.page)
         userexpense.findAll({
          where:{ExpenseuserdetailId:req.user.id}  
        }).then((expense)=>{
           let totalItems;
            totalItems=expense.length
    
    
        return  userexpense.findAll({
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
    }
    const dynamicPagination=(req,res)=>{
        const norNumber=req.body.nor
        res.status(200).json({message:'successful',norNumber:norNumber})
    }
    const addExpense=async(req,res)=>{
         const t=await sequelize.transaction();
    try{
        const ExpenseOfUser=await userexpense.create({
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
    
     res.status(200).json({updateUpdatedetails,ExpenseOfUser}) 
    }
      
    
    catch(error){
    (await t).rollback();
        console.log(error)
        res.status(400).json({message:"User Authentication failed"})
    
    }
}

const BuyPremium=async(req,res)=>{
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
    }
    
    
    const Login=async(req,res)=>{
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
    }
    const SignUP=async(req,res)=>{
    if(req.body.Name==""||req.body.Email==""||req.body.Password=="")
    {
        res.status(400).json({message:"Name or Email or Password is missing"})
    }
    else{
    try{
        const Passwordtaken=req.body.Password;
        const saltrounds=Number(process.env.SALTROUNDS);
         bcrypt.hash(Passwordtaken,saltrounds,async(error,hash)=>{
            console.log(error)
     try{
           await expenseuserdetails.create({
                Name:req.body.Name,
                Email:req.body.Email,
                Password:hash
    
            
            })
     }catch(error){
        res.status(405).json({message:"User Already Exists"})
 
     }
        })
    }

    
    catch(error){
        res.status(505).json({message:"Something went wrong"})
    }
    }
    }

    module.exports={
        deleteuserexpense,  
        getExpense,
        dynamicPagination,
        addExpense,
        BuyPremium,
        Login,
        SignUP
    }