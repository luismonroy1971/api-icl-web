import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';

export const Video = sequelize.define('videos',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo_video:{
        type: DataTypes.STRING
    },
    descripcion_video:{
        type: DataTypes.STRING(500)
    },
    fecha_video:{
        type: DataTypes.STRING
    },
    url_imagen_video:{
        type: DataTypes.STRING
    },
    url_video:{
        type: DataTypes.STRING
    },
    orden:{
        type: DataTypes.INTEGER
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


Video.beforeCreate((video, options) => {
    return Video.max('orden')
        .then((maxOrden) => {
            video.orden = maxOrden != null ? maxOrden + 1 : 1;
        });
});

Video.beforeUpdate((video, options) => {
    // Verifica si el campo descripcion_video ha cambiado antes de actualizar el campo label.
    if (video.changed('id')) {
      video.orden = video.id;
    }
  });