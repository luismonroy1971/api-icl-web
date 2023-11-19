import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Curso = sequelize.define('cursos',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    flag_adjunto:{
        type: DataTypes.ENUM(['URL', 'BIN']),
      },    
      url_documento: {
          type: DataTypes.STRING,
      },
      // Campo BLOB para el PDF
      contenido_documento: {
          type: DataTypes.BLOB('long'),
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
},{
    schema: "portal_icl",
    timestamps: false
})