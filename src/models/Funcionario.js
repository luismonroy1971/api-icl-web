import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Funcionario = sequelize.define('funcionarios',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING
    },
    position:{
        type: DataTypes.STRING
    },
    flag_adjunto:{
        type: DataTypes.ENUM(['URL', 'BIN']),
    },    
    url_documento: {
        type: DataTypes.STRING,
    },
      // Campo BLOB para la imagen
    contenido_documento: {
        type: DataTypes.BLOB('long'),
    }
    ,
    link:{
        type: DataTypes.TEXT
    },
    creado_por:{
        type: DataTypes.STRING
    },
    creado_fecha:{
        type: DataTypes.DATE
    },
    modificado_por:{
        type: DataTypes.STRING
    },
    modificado_fecha:{
        type: DataTypes.DATE
    },
    autorizado:{
        type:DataTypes.CHAR(1),
        defaultValue: '0'
    },
    autorizado_por:{
        type: DataTypes.STRING
    },
    autorizado_fecha:{
      type: DataTypes.DATE
    },
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{timestamps: false})