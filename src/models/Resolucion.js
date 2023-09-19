import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Resolucion = sequelize.define('resoluciones',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    period:{
        type: DataTypes.INTEGER
    },
    idarea:{
        type: DataTypes.INTEGER
    },
    idtypedocument:{
        type: DataTypes.INTEGER
    },
    number:{
        type: DataTypes.SMALLINT
    },
    aditional:{
        type: DataTypes.INTEGER
    },
    sumilla:{
        type: DataTypes.STRING
    },
    linkdocument:{
        type: DataTypes.STRING
    },
})