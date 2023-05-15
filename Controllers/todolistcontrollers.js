const { get } = require("../Routes/shoproutes")
const sequelize=require('../Model/todolist');

const getalldata=async(req,res,next)=>{
    try{
    const getdata= await sequelize.findAll({
    })
    res.json({getdata})

    }
    catch(error)
    {
        console.log(error)
    }
    }
    const deletedata=async(req,res,next)=>{
        console.log(req.params.id);
        try{
            const deletedata=await sequelize.delete({
    
                where:{id:req.params.id}
            })
            res.json({deletedata})
    
        }
        
        catch(error)
        {
            console.log(error)
        }
        }
       const submit=async(req,res,next)=>{
            console.log(req.body);
            try{
            const submitteddata= await sequelize.create({
            Todolist:req.body.Todo,
            Description:req.body.Description,
            
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