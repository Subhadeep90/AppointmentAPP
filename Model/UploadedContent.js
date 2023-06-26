const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const UploadedContent=sequelize.define('UploadedContent',{
       id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true

       },
       FileUrl:{
           type:Sequelize.STRING,
           allowNull:false
       },
       Userid:{
          type:Sequelize.INTEGER,
          allowNull:false

       }
    });
 module.exports=UploadedContent;