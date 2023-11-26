import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Servicio = sequelize.define('servicios',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_servicio:{
        type: DataTypes.ENUM(['TUPA','TUSNE'])
    },
    flag_seleccion: {
        type: DataTypes.SMALLINT
    },
    requisitos_servicio:{
        type: DataTypes.STRING
    },
    periodo_servicio:{
        type: DataTypes.INTEGER
    },
    numero_servicio:{
        type: DataTypes.SMALLINT
    },
    sub_nivel_servicio:{
        type: DataTypes.SMALLINT
    },
    denominacion_servicio:{
        type: DataTypes.STRING
    },
    por_uit:{
        type: DataTypes.DECIMAL
    },
    monto_soles:{
        type: DataTypes.DECIMAL
    },
    monto_uit:{
        type: DataTypes.DECIMAL
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
}, {
    schema: "portal_icl",
    timestamps: false
})

Servicio.beforeSave(async (servicio, options) => {
  if (servicio.tipo_servicio === 'TUPA') {
    servicio.monto_soles = servicio.por_uit * servicio.monto_uit;
  }
});