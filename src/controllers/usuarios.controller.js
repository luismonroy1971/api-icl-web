import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Usuario } from '../models/Usuario.js';
import { OpcionesUsuario } from '../models/OpcionesUsuario.js';
import { Menu } from '../models/Menu.js';
import { Sequelize } from 'sequelize';

export const registrarUsuario = async (req, res) => {
  const t = await Usuario.sequelize.transaction();

  try {
    const { name, email, password, profile, opcionesusuarios } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Registrar el usuario
    const nuevoUsuario = await Usuario.create(
      { name, email, password, profile },
      { transaction: t }
    );

    if (opcionesusuarios && opcionesusuarios.length > 0) {
      // Crear instancias de OpcionesUsuario relacionadas con el nuevo usuario
      await OpcionesUsuario.bulkCreate(
        opcionesusuarios.map((opcion) => ({
          id_usuario: nuevoUsuario.id,
          ...opcion,
        })),
        { transaction: t }
      );
    } else {
      // Si no se proporcionan opcionesusuarios, revertir la transacción y devolver un mensaje de error
      await t.rollback();
      return res
        .status(400)
        .json({ message: 'Debe proporcionar al menos una opción de usuario' });
    }

    // Confirmar la transacción
    await t.commit();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    // Revertir la transacción en caso de error
    await t.rollback();

    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para iniciar sesión y generar un token JWT
export const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ message: 'Usuario no existe' });
    }

    // Utiliza el método comparePassword para verificar la contraseña
    const contrasenaValida = usuario.comparePassword(password);

    if (!contrasenaValida) {
      return res.status(401).json({ message: 'Clave incorrecta' });
    }

    const token = generarTokenJWT(usuario);

    res.status(200).json({ token, usuario });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: OpcionesUsuario,
          attributes: ['id_menu'],
          include: {
            model: Menu,
            attributes: ['nombre_menu'],
          },
        },
      ],
    });

    const usuariosConOpcionesFormato = usuarios.map((usuario) => {
      const opcionesFormato = usuario.opcionesusuarios
        ? usuario.opcionesusuarios
            .map((opcion) => {
              return opcion.menu
                ? { value: opcion.id_menu, label: opcion.menu.nombre_menu }
                : null;
            })
            .filter((opcion) => opcion !== null) // Filter out null values
        : [];

      return {
        ...usuario.get({ plain: true }),
        opcionesusuarios: opcionesFormato,
      };
    });

    res.status(200).json(usuariosConOpcionesFormato);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para obtener un usuario por su ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    const usuario = await Usuario.findByPk(usuarioId, {
      include: [
        {
          model: OpcionesUsuario,
          include: [
            {
              model: Menu,
              attributes: [
                'nombre_menu',
                'etiqueta_menu',
                'descripcion_menu',
                'tipo_menu',
                'url',
              ],
            },
          ],
        },
      ],
      attributes: {
        exclude: ['password'],
        include: [
          [Sequelize.literal(`'{"label": "' || profile || '"}'`), 'profileObj'],
        ],
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Convertir 'profileObj' de string a objeto JSON
    const usuarioConProfile = {
      ...usuario.get({ plain: true }),
      profile: JSON.parse(usuario.getDataValue('profileObj')),
    };

    res.status(200).json(usuarioConProfile);
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id; // ID del usuario a actualizar
    const { name, profile, email, password, opcionesusuarios } = req.body; // Nuevos datos del usuario y opciones

    // Busca el usuario en la base de datos por su ID
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualiza los datos del usuario
    usuario.name = name;
    usuario.email = email;
    usuario.profile = profile;

    if (password) {
      usuario.password = password;
      // const saltRounds = 10;
      // const hashedPassword = await bcrypt.hash(password, saltRounds);
      // usuario.password = hashedPassword;
    }

    await usuario.save(); // Guarda los cambios en la base de datos

    // Actualiza las opciones de usuario si se proporcionan en la solicitud
    if (opcionesusuarios && opcionesusuarios.length > 0) {
      // Elimina las opciones actuales del usuario
      await OpcionesUsuario.destroy({ where: { id_usuario: usuario.id } });

      // Crea instancias de OpcionesUsuario relacionadas con el usuario
      await OpcionesUsuario.bulkCreate(
        opcionesusuarios.map((opcion) => ({
          id_usuario: usuario.id,
          ...opcion,
        }))
      );
    }

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para generar un token JWT
const generarTokenJWT = (usuario) => {
  const payload = {
    userId: usuario.id,
    email: usuario.email,
  };

  const secretKey = 'Icl2023@vamos'; // Reemplaza con tu propia clave secreta

  const token = jwt.sign(payload, secretKey, { expiresIn: '5h' });

  return token;
};

export const activarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.activo = '1'; // Establecer activo en '1'
    await usuario.save();

    res.json({ mensaje: 'Usuario activado correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

export const desactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.activo = '0'; // Establecer activo en '0'
    await usuario.save();

    res.json({ mensaje: 'Usuario desactivado correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};
