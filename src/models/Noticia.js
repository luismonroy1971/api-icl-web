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
        type: DataTypes.STRING
    },
    linkimage1:{
        type: DataTypes.STRING
    },
    linkimage2:{
        type: DataTypes.STRING
    },
    linkimage3:{
        type: DataTypes.STRING
    },
    linkimage4:{
        type: DataTypes.STRING
    },
})

