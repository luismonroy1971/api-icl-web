import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Menu } from './Menu.js';

export const CamposTablas = sequelize.define('campostablas',{
    id:{
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    tabla:{
        type: DataTypes.STRING
    },
    nombre_campo:{
        type: DataTypes.STRING(50)
    },
    tipo:{
        type: DataTypes.STRING(15)
    },
    backend:{
        type: DataTypes.STRING(50)
    },
    ancho: {
        type: DataTypes.INTEGER,
    },
    valores:{
        type:DataTypes.STRING(100)
    }
}, { timestamps: false })

CamposTablas.belongsTo(Menu, {
  foreignKey: 'id_menu', // Asegúrate de que este sea el nombre correcto de la clave foránea
  targetKey: 'id', // Asegúrate de que este sea el nombre correcto de la clave primaria en la tabla Menu
  required: false,
});