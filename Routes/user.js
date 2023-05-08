const express=require('express');
const router=express.Router();
const usercontroller=require('../Controllers/usercontroller')
router.get('/submitted/getdetails',usercontroller.adduser)

router.delete('/submitted/deleteItems/:id',usercontroller.deleteuser)
router.post('/submitted',usercontroller.postuser)
    
    

    exports.module=router;