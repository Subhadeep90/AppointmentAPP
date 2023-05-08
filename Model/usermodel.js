const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const userdetails= sequelize.define('userDetails',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
       },
    Username:{
     type:Sequelize.STRING,
     allowNull:false
    },
    PhoneNumber:{
        type:Sequelize.CHAR,
        allowNull:false,
        unique:true,
       },
       EmailId:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
       }
    });
 module.exports=userdetails;
// // const Sequelize=require('sequelize');
// // const sequelize=require('../util/database');
// // const Product=sequelize.define('product',{
// //   id:{
// //     type:Sequelize.INTEGER,
// //     autoIncrement:true,
// //     allowNull:false,
// //     primaryKey:true
// //   },
// //   title:Sequelize.STRING,
// //   price:{
// //     type:Sequelize.DOUBLE,
// //     allowNull:false
// //   },
// //   imageURL:{
// //     type:Sequelize.STRING,
// //     allowNull:false
// //   },
// //   description:{
// //    type:Sequelize.STRING,
// //    allowNull:false
// //   }
// // });
// // module.exports=Product;