const express=require('express');
const router=express.Router();
const sellercontroller=require('../Controllers/sellercontroller')
router.get('/submitted/getdetails',sellercontroller.adduser)

router.delete('/submitted/deleteItems/:id',sellercontroller.deleteuser)
router.post('/submitted',sellercontroller.postuser)
    
    

    exports.module=router;