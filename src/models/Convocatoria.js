import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Anexo } from './Anexo.js';
import { Curriculo } from './Curriculo.js';
import { Comunicacion1 } from './Comunicacion1.js';
import { Comunicacion2 } from './Comunicacion2.js';
import { Comunicacion3 } from './Comunicacion3.js';
import { Comunicacion } from './Comunicacion.js';
import { Aviso } from './Aviso.js';
import { Examen } from './Examen.js';
import { Entrevista } from './Entrevista.js';
import { Final } from './Final.js';


export const Convocatoria = sequelize.define('convocatorias', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descripcion_convocatoria: {
        type: DataTypes.STRING(300),
    },
    tipo_convocatoria: {
        type: DataTypes.ENUM(['CAS', 'PPP']),
    },
    numero_convocatoria: {
        type: DataTypes.INTEGER,
    },
    periodo_convocatoria: {
        type: DataTypes.INTEGER,
    },
    flag_adjunto:{
      type: DataTypes.ENUM(['URL', 'BIN']),
    },   
    estado_convocatoria: {
        type: DataTypes.ENUM(['Abierto','Cancelado', 'Cerrado', 'Desierto']),
    },
    creado_por: {
        type: DataTypes.STRING,
    },
    creado_fecha: {
        type: DataTypes.DATE,
    },
    modificado_por: {
        type: DataTypes.STRING,
    },
    modificado_fecha: {
        type: DataTypes.DATE,
    },
    autorizado: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
    },
    autorizado_por: {
        type: DataTypes.STRING,
    },
    autorizado_fecha: {
        type: DataTypes.DATE,
    },
    activo: {
        type: DataTypes.CHAR(1),
        defaultValue: '1',
    }
}, {
    schema: "portal_icl",
    timestamps: false
});

Convocatoria.hasMany(Anexo,{
    foreignKey: 'id_convocatoria',
    sourceKey: 'id'
})

Convocatoria.hasMany(Comunicacion1,{
    foreignKey: 'id_convocatoria',
    sourceKey: 'id'
})

Convocatoria.hasMany(Comunicacion2,{
    foreignKey: 'id_convocatoria',
    sourceKey: 'id'
})

Convocatoria.hasMany(Comunicacion3,{
    foreignKey: 'id_convocatoria',
    sourceKey: 'id'
})



Convocatoria.hasMany(Comunicacion,{
    foreignKey: 'id_convocatoria',
    sourceKey: 'id'
})

Convocatoria.hasMany(Aviso,{
    foreignKey: 'id_convocatoria',
    sourceKey: 'id'
})

Convocatoria.hasMany(Curriculo,{
    foreignKey: 'id_convocatoria',
    sourceKey: 'id'
})

Convocatoria.hasMany(Examen,{
    foreignKey: 'id_convocatoria',
    sourceKey: 'id'
})

Convocatoria.hasMany(Entrevista,{
    foreignKey: 'id_convocatoria',
    sourceKey: 'id'
})

Convocatoria.hasMany(Final,{
    foreignKey: 'id_convocatoria',
    sourceKey: 'id'
})
