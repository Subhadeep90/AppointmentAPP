const express=require('express')
const router=express.Router()
const sequelize=require('../Model/todolist');

const todocontrollers=require('../Controllers/todolistcontrollers')
router.get('/submitdetails/getdata',todocontrollers.getalldata)
router.delete('/submitdetails/delete/:id',todocontrollers.deletedata)


router.post('/submitdetails',todocontrollers.submit)

module.exports=router;