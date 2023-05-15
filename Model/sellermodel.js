const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const sellerdetails=sequelize.define('sellerdetails',{
       id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
       },
    SellingPrice:{
     type:Sequelize.INTEGER,
     allowNull:false,
    },
    ProductName:{
        type:Sequelize.STRING,
        allowNull:false,
       },
       Category:{
        type:Sequelize.STRING,
        allowNull:false,
       }
    });
 module.exports=sellerdetails;
  
