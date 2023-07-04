const sequelize = require('../util/database');

const userauthentication=require('../middleware/auth')
const express=require('express');
const router=express.Router()
const purchasecontroller=require('../Controllers/expensepurchasecontroller')



router.post('/purchase/updatetransactionstatus',purchasecontroller.updatetransaction)   
    

router.get('/premiumuser/leaderboard',purchasecontroller.PremiumUserLeaderboard)

module.exports=router;