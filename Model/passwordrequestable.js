const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const passwordrequest=sequelize.define('ForgotpasswordRequest',{
       id:{
        type:Sequelize.STRING,
        primaryKey:true,
        allowNull:false

       },
     userId:Sequelize.INTEGER,
      isActive:Sequelize.BOOLEAN
    
    });
 module.exports=passwordrequest;
  