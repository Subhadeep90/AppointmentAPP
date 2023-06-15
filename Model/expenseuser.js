
const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const userexpense=sequelize.define('userexpense',{
       id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
       },
    Expenditure:{
     type:Sequelize.INTEGER,
     allowNull:false,
    },
    Description:{
        type:Sequelize.STRING,
        allowNull:false,
       },
       Category:{
        type:Sequelize.STRING,
        allowNull:false,
       }
    });
 module.exports=userexpense;
  
