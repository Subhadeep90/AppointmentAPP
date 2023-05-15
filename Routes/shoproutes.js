const express=require('express')
const router=express.Router()
const shopcontrollers=require('../Controllers/shopcontroller')
router.get('/submitshopdetails/getdata',shopcontrollers.getalldata)
router.put('/submitshopdetails/updateid/:id',shopcontrollers.update)
router.post('/submitshopdetails',shopcontrollers.submit)

module.exports=router;