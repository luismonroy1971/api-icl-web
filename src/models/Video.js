import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Noticia = sequelize.define('noticias',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type: DataTypes.STRING
    },
    description:{
        type: DataTypes.STRING
    },
    date:{
        type: DataTypes.DATE
    },
    idcategory:{
        type: DataTypes.INTEGER
    },
    linkimage:{
        type: DataTypes.STRING
    },
    linkvideo:{
        type: DataTypes.STRING
    },
})