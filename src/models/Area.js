import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Resolucion } from './Resolucion.js';
import { Directiva } from './Directiva.js';
import { Convocatoria } from './Convocatoria.js';


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

Area.hasMany(Directiva,{
    foreignKey: 'id_area',
    sourceKey: 'id'
})

Area.hasMany(Convocatoria,{
    foreignKey: 'id_area',
    sourceKey: 'id'
})
