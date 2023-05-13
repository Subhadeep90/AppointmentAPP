const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const expensedetails=sequelize.define('Expense',{
       id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
       },
    Item:{
     type:Sequelize.STRING,
     allowNull:false,
    },
    Description:{
        type:Sequelize.STRING,
        allowNull:false,
       },
       Expense:{
        type:Sequelize.STRING,
        allowNull:false,
       }
    });
 module.exports=expensedetails;
  

