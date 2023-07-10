const sequelize = require('../util/database');

const userauthentication=require('../middleware/auth')
const express=require('express');
const router=express.Router()
const expenseDownloadfileController=require('../Controllers/expensedownloadfilecontroller')

router.get('/download/listoffiles',userauthentication,expenseDownloadfileController.DownloadListoffiles)


router.get('/download',userauthentication,expenseDownloadfileController.getDownload)
module.exports=router;