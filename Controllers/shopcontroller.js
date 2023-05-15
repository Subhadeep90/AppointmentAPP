const { get } = require("../Routes/shoproutes")
const sequelize=require('../Model/shopmodel');

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
    const update=async(req,res,next)=>{
        console.log(req.params.id);
        try{
            const updatedata=await sequelize.update({
                Quantity:req.body.Quantity
                },
                {
                where:{id:req.params.id}
            })
            res.json({updatedata})
    
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
            ItemName:req.body.ItemName,
            Description:req.body.Description,
            Price:req.body.Price,
            Quantity:req.body.Quantity,
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
        update,
        submit,
    }