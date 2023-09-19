import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Resolucion } from './Resolucion.js';

export const Area = sequelize.define('areas',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    description:{
        type: DataTypes.STRING
    },
    abreviation:{
        type: DataTypes.CHAR(2)
    }
})

Area.hasMany(Resolucion,{
    foreignKey: 'idarea',
    sourceKey: 'id'
})

Resolucion.belongsTo(Area, {
    foreignKey: 'idarea',
    targetId: 'id'
})

