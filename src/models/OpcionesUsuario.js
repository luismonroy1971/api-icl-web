import {DataTypes} from 'sequelize';
import {sequelize} from '../database/database.js';
import { Menu } from './Menu.js';

export const OpcionesUsuario = sequelize.define('opcionesusuario',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, { timestamps: false })

OpcionesUsuario.belongsTo(Menu, {
  foreignKey: 'id_menu', // Asegúrate de que este sea el nombre correcto de la clave foránea
  targetKey: 'id', // Asegúrate de que este sea el nombre correcto de la clave primaria en la tabla Menu
});
