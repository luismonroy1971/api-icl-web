import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import bcrypt from 'bcrypt';
import { OpcionesUsuario } from './OpcionesUsuario.js';

export const Usuario = sequelize.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    profile:{
        type: DataTypes.ENUM(['Administrador','Creador','Autorizador'])
    },
    password: {
        type: DataTypes.STRING, // Agregar un campo para la contraseña
        set(value) {
            // Encriptar la contraseña antes de guardarla
            const saltRounds = 10;
            const hashedPassword = bcrypt.hashSync(value, saltRounds);
            this.setDataValue('password', hashedPassword);
        }
    },
    activo: {
        type: DataTypes.CHAR(1),
        defaultValue: '1'
    },
}, {
    schema: "portal_icl",
    timestamps: false
});

// Método para comparar contraseñas
Usuario.prototype.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

Usuario.hasMany(OpcionesUsuario,{
    foreignKey: 'id_usuario',
    sourceKey: 'id'
})