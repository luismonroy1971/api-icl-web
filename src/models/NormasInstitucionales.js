import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Norma = sequelize.define('normasinstitucionales',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_norma:{
        type: DataTypes.ENUM(['Planes y Política','Instrumentos de Gestión'])
    },
    denominacion_norma:{
        type: DataTypes.STRING
    },
    url_norma:{
        type: DataTypes.STRING
    },
    autorizado:{
        type:DataTypes.CHAR(1),
        defaultValue: '0'
    },
    autorizado_por:{
        type: DataTypes.STRING
    },  
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    },
},{timestamps: false})