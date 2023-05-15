const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const todolistdetails=sequelize.define('todolistdetails',{
       id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
       },
    Todolist:{
     type:Sequelize.STRING,
     allowNull:false,
    },
    Description:{
        type:Sequelize.STRING,
        allowNull:false,
       },
       
    });
 module.exports=todolistdetails;
  
