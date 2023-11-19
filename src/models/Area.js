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
    label:{
        type: DataTypes.STRING
    },
    activo:{
        type:DataTypes.CHAR(1),
        defaultValue: '1'
    }
},{
    schema: "portal_icl",
    timestamps: false
})

Area.beforeCreate((area, options) => {
    area.label = area.descripcion_area;
  });
  
  Area.beforeUpdate((area, options) => {
    // Verifica si el campo descripcion_area ha cambiado antes de actualizar el campo label.
    if (area.changed('descripcion_area')) {
      area.label = area.descripcion_area;
    }
  });

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
