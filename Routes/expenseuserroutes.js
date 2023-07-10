
const { Model } = require('sequelize');
const sequelize = require('../util/database');

const userauthentication=require('../middleware/auth')
const express=require('express');
const router=express.Router()
const expenseusercontroller=require('../Controllers/expenseusercontroller')
router.delete('/expense/deleteexpense/:id',userauthentication,expenseusercontroller.deleteuserexpense)
    router.get('/expense/getexpense',userauthentication,expenseusercontroller.getExpense)
    router.post('/expense/dynamicpagination',expenseusercontroller.dynamicPagination)
    router.post('/expense/addexpense',userauthentication,expenseusercontroller.addExpense)

router.get('/buypremium',userauthentication,expenseusercontroller.BuyPremium)
    
    
    router.post('/Login',expenseusercontroller.Login)
    router.post('/Signup',expenseusercontroller.SignUP)
module.exports=router;