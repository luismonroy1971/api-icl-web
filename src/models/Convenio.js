import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Convenio = sequelize.define('convenios', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion_convenio: {
    type: DataTypes.STRING,
    },
    flag_adjunto:{
      type: DataTypes.ENUM(['URL', 'BIN']),
    },    
    url_documento: {
      type: DataTypes.STRING,
    },
    contenido_documento: {
    type: DataTypes.BLOB('long'), // Almacena datos binarios (PDF) de longitud variable
    },
    fecha_convenio: {
      type: DataTypes.DATE,
    },
    periodo_convenio: {
      type: DataTypes.INTEGER, // Cambiar a INTEGER para almacenar el año
      allowNull: true, // Permitir valores nulos
    },
    periodo_mes: {
      type: DataTypes.INTEGER, // Cambiar a INTEGER para almacenar el mes
      allowNull: true, // Permitir valores nulos
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
    autorizado: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
    },
    autorizado_por: {
      type: DataTypes.STRING,
    },
    autorizado_fecha:{
      type: DataTypes.DATE
    },
    activo: {
      type: DataTypes.CHAR(1),
      defaultValue: '1',
    },
  }, { timestamps: false });
  
  // Agregar el gancho antes de guardar para calcular y almacenar los campos virtuales
  Convenio.beforeSave((convenio, options) => {
    const fechaConvenio = convenio.getDataValue('fecha_convenio');
    if (fechaConvenio) {
      // Calcular el año y el mes
      convenio.set('periodo_convenio', new Date(fechaConvenio).getFullYear());
      convenio.set('periodo_mes', new Date(fechaConvenio).getMonth() + 1);
    }
  });

  