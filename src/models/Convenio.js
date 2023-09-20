import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Convenio = sequelize.define('convenios',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion_convenio:{
        type: DataTypes.STRING
    },
    url_documento_convenio:{
        type: DataTypes.STRING
    },
    periodo_convenio:{
        type: DataTypes.INTEGER
    },
    numero_convenio:{
        type: DataTypes.INTEGER,
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