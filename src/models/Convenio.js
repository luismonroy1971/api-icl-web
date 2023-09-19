import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Convenio = sequelize.define('convenios',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description:{
        type: DataTypes.STRING
    },
    linkDocument:{
        type: DataTypes.STRING
    },
    period:{
        type: DataTypes.INTEGER
    },
    number:{
        type: DataTypes.INTEGER,
    },
})