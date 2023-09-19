import  Sequelize  from "sequelize";
export const sequelize = new Sequelize('icl_web','postgres','Lm@03051971',{
    host: 'localhost',
    dialect: 'postgres'
});
