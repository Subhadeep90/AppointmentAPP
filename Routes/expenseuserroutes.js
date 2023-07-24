
const { Model } = require('sequelize');
const sequelize = require('../util/database');

const userauthentication=require('../middleware/auth')
const express=require('express');
const router=express.Router()
const expenseusercontroller=require('../Controllers/expenseusercontroller')
router.delete('/user/expense/deleteexpense/:id',userauthentication,expenseusercontroller.deleteuserexpense)
    router.get('/user/expense/getexpense',userauthentication,expenseusercontroller.getExpense)
    router.post('/user/expense/dynamicpagination',expenseusercontroller.dynamicPagination)
    router.post('/user/expense/addexpense',userauthentication,expenseusercontroller.addExpense)

router.get('/user/buypremium',userauthentication,expenseusercontroller.BuyPremium)
    
    
    router.post('/user/Login',expenseusercontroller.Login)
    router.post('/user/Signup',expenseusercontroller.SignUP)
module.exports=router;