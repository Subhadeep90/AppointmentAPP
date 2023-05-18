const { get } = require("../Routes/shoproutes")
const sequelize=require('../Model/todolist');

const getalldata=async(req,res,next)=>{
    try{
        const alldata=await sequelize.findAll({

        })
        res.json({alldata})

    }

catch(error)
{
    console.log(error)
}


}


const deletedata=async(req,res,next)=>{
    try{
        sequelize.destroy({where:{
            id:req.params.id
        }})
    }

catch(error)
{
    console.log(error)
}


}

const submit=async(req,res,next)=>{
    try{
        const submitteddata=await sequelize.create({
        Todolist:req.body.todoitem,
        Description:req.body.tododescription
    })
    res.json({submitteddata})
}
catch(error)
{
    console.log(error)
}


}
    module.exports={
        getalldata,
        deletedata,
        submit,
    }