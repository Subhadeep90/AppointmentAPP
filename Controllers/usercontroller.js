const userdetails = require('../Model/usermodel');

const adduser=(req,res,next)=>{
    userdetails.findAll().then((resolve)=>{
        res.json(resolve)
    }).catch((error)=>{
        console.log(error)
    })
}
const deleteuser=(req,res,next)=>{
    const userid=req.params.id;
    userdetails.destroy({where:{id:userid}})
     .then((resolve)=>{
         console.log(resolve)
     }).catch((error)=>{
         console.log(error)
     });
    }

const postuser=async(req,res,next)=>{
    const data=await userdetails.create({
       Username:req.body.Name,
       PhoneNumber:req.body.PhoneNumber, 
       EmailId:req.body.Email 
  
 
     })
     res.json({newuserdetails:data})
     }

module.exports={
    adduser,
    deleteuser,
    postuser
}