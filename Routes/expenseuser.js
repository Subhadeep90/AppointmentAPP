const express=require('express');
const router=express.Router();
const expensecontroller=require('../Controllers/expensecontroller')
router.get('/expensesubmitted/getDetails',expensecontroller.getdata)

router.delete('/expensesubmitted/getDetails/deletedetails/:id',expensecontroller.deletedetails)



router.post('/expensesubmitted',expensecontroller.postdata)
module.exports=router;