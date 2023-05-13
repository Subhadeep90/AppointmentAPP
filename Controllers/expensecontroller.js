const expensedetails = require('../Model/Expense');

const getdata=(req,res,next)=>{
    expensedetails.findAll()
    .then((result)=>{
     res.json(result)
    }).catch((error)=>{
        console.log(error);
    })
}
const deletedetails=(req,res,next)=>{
    const iddeleted=req.params.id;
    expensedetails.destroy({
        where:{
            id:iddeleted
        }
    }).then((result)=>{
        res.json(result)
    }).catch((error)=>{
        console.log(error);
    })
}
const postdata=async(req,res,next)=>{
    const expensedata=await expensedetails.create({
        Item:req.body.item,
        Description:req.body.Description,
        Expense:req.body.Expense,
    })
    res.json({expensedata})
    }



module.exports={
    getdata,
    deletedetails,
    postdata
}