import { Sequelize } from 'sequelize';
import {Funcionario} from '../models/Funcionario.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

export const leerFuncionarios = async (req, res) =>{
  try {
    const { activo } = req.params;
    const whereClause = activo ? { activo } : {};

    const funcionarios = await Funcionario.findAll({
      where: whereClause,
    });

    res.json(funcionarios);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
}



export const buscarFuncionarios = async (req, res) => {
  const { name, position, autorizado, activo } = req.query;

  try {
      const whereClause = {};

      if (autorizado) {
          whereClause.autorizado = autorizado;
      }

      if (name) {
          whereClause.name = name;
      }

      if (position) {
          whereClause.position = {
              [Sequelize.Op.like]: `%${position}%`
          };
      }

      if (activo) {
          whereClause.activo = activo;
      }

      const funcionarios = await Funcionario.findAll({
          where: Object.keys(whereClause).length === 0 ? {} : whereClause,
          order: [['id', 'ASC']]
      });

      // Mapear los resultados para agregar el campo virtual 'image'
      const funcionariosConImagen = funcionarios.map((funcionario) => {
          const { flag_adjunto, url_documento, contenido_documento } = funcionario;
          
          // Asegurarse de que contenido_documento no sea null antes de acceder a 'toString'
          const image = flag_adjunto === 'URL' ? url_documento : contenido_documento ? `data:image/png;base64,${contenido_documento.toString('base64')}` : null;

          return { ...funcionario.toJSON(), image };
      });

      res.json(funcionariosConImagen);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};


  

export const leerFuncionario = async (req, res) =>{
    const { id } = req.params;
    try {
        const funcionario = await Funcionario.findOne({
            where:{
                id
            }
        })
        res.json(funcionario);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearFuncionario = async (req, res) => {
    const { name, position, flag_adjunto, link, creado_por, creado_fecha } = req.body;
    const imgFile = req.file;

    try {
        let url_documento = null;
        let contenido_documento = null;

        // Validar el tamaño del archivo adjunto
        if (imgFile && imgFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        // Manejar la lógica según el tipo de adjunto (URL o BIN)
        if (imgFile) {
            if (flag_adjunto === 'URL') {
              const __dirname = path.dirname(fileURLToPath(import.meta.url));
              const documentosDir = path.join(__dirname, '..', 'documentos', 'funcionarios');
              const originalFileName = imgFile.originalname;
              const filePath = path.join(documentosDir, originalFileName);
              await fs.mkdir(documentosDir, { recursive: true });
              await fs.copyFile(imgFile.path, filePath);
              url_documento = `${baseUrl}/documentos/funcionarios/${originalFileName}`;
            } else if (flag_adjunto === 'BIN') {
                // Leer el contenido del archivo
                contenido_documento = await fs.readFile(imgFile.path);
            }
        }

        // Crear un nuevo funcionario en la base de datos
        const nuevoFuncionario = await Funcionario.create({
            name,
            position,
            flag_adjunto,
            url_documento,
            contenido_documento,
            link,
            creado_por,
            creado_fecha,
        });

        // Responder con el nuevo funcionario creado
        return res.status(201).json({ mensaje: 'Funcionario creado con éxito', nuevoFuncionario });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear funcionario', error: error.message });
    }
};


export const actualizarFuncionario = async (req, res) => {
    const { id } = req.params;
    const { name, position, flag_adjunto, image, link, modificado_por, modificado_fecha, activo } = req.body;
    const imgFile = req.file;

    try {
        // Buscar el funcionario por su ID
        const funcionario = await Funcionario.findByPk(id);

        // Verificar si el funcionario existe
        if (!funcionario) {
            return res.status(404).json({ mensaje: 'Funcionario no encontrado' });
        }

        // Validar el tamaño del archivo adjunto
        if (imgFile && imgFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        // Actualizar las propiedades del funcionario
        funcionario.name = name;
        funcionario.position = position;
        funcionario.modificado_por = modificado_por;
        funcionario.modificado_fecha = modificado_fecha;
        funcionario.autorizado = '0';
        funcionario.autorizado_por = null;
        funcionario.autorizado_fecha = null;
        funcionario.activo = activo;

        // Manejar la lógica según el tipo de adjunto (URL o BIN)
        if (imgFile) {
          const __dirname = path.dirname(fileURLToPath(import.meta.url));
          const documentosDir = path.join(__dirname, '..','documentos', 'funcionarios');
          const originalFileName = imgFile.originalname;
          const filePath = path.join(documentosDir, originalFileName);

          if (flag_adjunto === 'URL') {
              // Crear el directorio si no existe y copiar el archivo
              await fs.mkdir(documentosDir, { recursive: true });
              await fs.copyFile(imgFile.path, filePath);
              funcionario.url_documento = `${baseUrl}/documentos/funcionarios/${originalFileName}`;
              funcionario.contenido_documento = null;
              funcionario.flag_adjunto = "URL";
          } else if (flag_adjunto === 'BIN') {
              // Leer el contenido del archivo
              funcionario.url_documento = null;
              funcionario.contenido_documento = await fs.readFile(imgFile.path);
              funcionario.flag_adjunto = "BIN";
          }
        }

        // Guardar los cambios en la base de datos
        await funcionario.save();

        // Responder con un mensaje de éxito
        return res.status(200).json({ mensaje: 'Funcionario actualizado correctamente', funcionario });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al modificar funcionario', error: error.message });
    }
};




export const autorizarFuncionario = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try{
  const funcionario = await Funcionario.findByPk(id);
  funcionario.autorizado = autorizado;
  funcionario.autorizado_por = autorizado_por;
  funcionario.autorizado_fecha = autorizado_fecha;
  await funcionario.save(); 
  res.send('Funcionario autorizado / desautorizado');
  }
  catch(error){
       return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarFuncionario = async (req, res) =>{

    try {
        const { id } = req.params
        await Funcionario.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarFuncionario = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const funcionario = await Funcionario.findByPk(id);
  
      if (!funcionario) {
        return res.status(404).json({ mensaje: 'Funcionario no encontrado' });
      }
  
      funcionario.activo = '1'; // Establecer activo en '1'
      await funcionario.save();
  
      res.json({ mensaje: 'Funcionario activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarFuncionario = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const funcionario = await Funcionario.findByPk(id);
  
      if (!funcionario) {
        return res.status(404).json({ mensaje: 'Funcionario no encontrado' });
      }
  
      funcionario.activo = '0'; // Establecer activo en '0'
      await funcionario.save();
  
      res.json({ mensaje: 'Funcionario desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
