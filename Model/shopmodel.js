const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const { DOUBLE } = require('mysql4/lib/constants/types');
const shop=sequelize.define('shopdetails',{
       id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
       },
    ItemName:{
     type:Sequelize.STRING,
     allowNull:false,
    },
    Description:{
        type:Sequelize.STRING,
        allowNull:false,
       },
       Price:{
        type:Sequelize.DOUBLE,
        allowNull:false,
       },
       Quantity:{
           type:Sequelize.DOUBLE,
           allowNull:false
       }
    });
 module.exports=shop;
  
