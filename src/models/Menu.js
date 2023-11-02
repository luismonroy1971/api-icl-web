import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { OpcionesUsuario } from './OpcionesUsuario.js';

export const Menu = sequelize.define('menus',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    primer_nivel:{
        type: DataTypes.CHAR(2)
    },
    segundo_nivel:{
        type: DataTypes.CHAR(2)
    },
    nombre_menu:{
        type: DataTypes.STRING(50)
    },
    etiqueta_menu:{
        type: DataTypes.STRING(20)
    },
    descripcion_menu:{
        type: DataTypes.STRING(300)
    },
    tipo_menu:{
        type: DataTypes.ENUM(['ADMINISTRADOR', 'USUARIO']),
        defaultValue: 'USUARIO'
    },
    url:{
        type: DataTypes.STRING
    }
},{timestamps: false})

const init = async () => {
  const { OpcionesUsuario } = await import('./OpcionesUsuario.js');

  Menu.hasMany(OpcionesUsuario, {
    foreignKey: 'id_menu',
    sourceKey: 'id',
  });
};

