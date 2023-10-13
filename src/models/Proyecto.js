import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Proyecto = sequelize.define('proyectos',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image:{
        type: DataTypes.STRING
    },
    video:{
        type: DataTypes.STRING
    },
    title:{
        type: DataTypes.STRING
    },
    content:{
        type: DataTypes.TEXT
    },
    link:{
        type: DataTypes.STRING
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