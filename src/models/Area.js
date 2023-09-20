import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Resolucion } from './Resolucion.js';

export const Area = sequelize.define('areas',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion_area:{
        type: DataTypes.STRING
    },
    abreviacion_area:{
        type: DataTypes.CHAR(2)
    }, 
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{timestamps: false})

Area.hasMany(Resolucion,{
    foreignKey: 'id_area',
    sourceKey: 'id'
})

Resolucion.belongsTo(Area, {
    foreignKey: 'id_area',
    targetId: 'id'
})

