import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Usuario } from '../models/Usuario.js'; // Ajusta la importación según tu estructura de archivos
import { OpcionesUsuario } from '../models/OpcionesUsuario.js';

// Función para registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { name, email, password, profile, opcionesusuarios } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Registrar el usuario
    const nuevoUsuario = await Usuario.create({ name, email, password, profile });

    if (opcionesusuarios && opcionesusuarios.length > 0) {
      // Crear instancias de OpcionesUsuario relacionadas con el nuevo usuario
      await OpcionesUsuario.bulkCreate(
        opcionesusuarios.map((opcion) => ({ id_usuario: nuevoUsuario.id, ...opcion }))
      );
    }

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
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
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };

// Función para obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para obtener un usuario por su ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    // Utiliza el método `findByPk` para buscar el usuario por ID
    const usuario = await Usuario.findByPk(usuarioId, {
      include: [
        {
          model: OpcionesUsuario,
          attributes: ['id_menu'], // Incluye los campos id_menu e id_usuario
        },
      ],
      attributes: { exclude: ['password'] }, // Excluye la propiedad 'password' del usuario
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};



export const actualizarUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id; // ID del usuario a actualizar
    const { name, profile, email, password, opciones } = req.body; // Nuevos datos del usuario y opciones

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
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      usuario.password = hashedPassword;
    }

    await usuario.save(); // Guarda los cambios en la base de datos

    // Actualiza las opciones de usuario
    if (opciones && opciones.length > 0) {
      // Elimina las opciones actuales del usuario
      await OpcionesUsuario.destroy({ where: { id_usuario: usuario.id } });

      // Crea instancias de OpcionesUsuario relacionadas con el usuario
      await OpcionesUsuario.bulkCreate(
        opciones.map((opcion) => ({ id_usuario: usuario.id, ...opcion }))
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

  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

  return token;
};
