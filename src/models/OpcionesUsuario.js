import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Menu } from './Menu.js';

// Definición del modelo OpcionesUsuario
export const OpcionesUsuario = sequelize.define('opcionesusuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_menu: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    schema: "portal_icl",
    timestamps: false
});

// Relación con el modelo Menu
OpcionesUsuario.belongsTo(Menu, {
    foreignKey: 'id_menu',
    targetKey: 'id'
});

// Exportar el modelo
export default OpcionesUsuario;
