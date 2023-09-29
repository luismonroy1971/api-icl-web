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
    periodo_mes: {
        type: DataTypes.VIRTUAL, // Campo virtual
        get() {
          // Extraer el número de mes del campo periodo_convenio
          const periodoConvenio = this.getDataValue('periodo_convenio');
          if (periodoConvenio) {
            // Extraer el número de mes (1-12)
            return new Date(periodoConvenio).getMonth() + 1;
          }
          return null; // Devolver null si no hay periodo_convenio
        },
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