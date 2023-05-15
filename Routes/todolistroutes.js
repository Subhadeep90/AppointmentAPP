const express=require('express')
const router=express.Router()
const todocontrollers=require('../Controllers/todolistcontrollers')
router.get('/submitdetails/getdata',todocontrollers.getalldata)
router.delete('/submitdetails/deletedata/:id',todocontrollers.deletedata)
router.post('/submitdetails',todocontrollers.submit)

module.exports=router;