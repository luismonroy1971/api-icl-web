import { Sequelize } from 'sequelize';
import {Norma} from '../models/NormasInstitucionales.js';
import { v4 as uuidv4 } from 'uuid'; // Para generar un nombre de archivo único
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import { fileURLToPath } from 'url';

const baseUrl = process.env.BASE_URL; 

export const leerNormas = async (req, res) =>{
    try {
        const normas = await Norma.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(normas);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarNormas = async (req, res) => {
    const { tipo_norma, denominacion_norma, autorizado, activo } = req.query;
  
    try {
      const whereClause = {};
  
      if (tipo_norma) {
        whereClause.tipo_norma = tipo_norma;
      }
  
      if (autorizado) {
        whereClause.autorizado = autorizado;
      }

      if (denominacion_norma) {
        whereClause.denominacion_norma = {
          [Sequelize.Op.like]: `%${denominacion_norma}%`
        };
      }

      if (activo) {
        whereClause.activo = activo;
      }
  
      const normas = await Norma.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
      });
  
      res.json(normas);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const leerNorma = async (req, res) =>{
    const { id } = req.params;
    try {
        const norma = await Norma.findOne({
            where:{
                id
            }
        })
        res.json(norma);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


export const crearNorma = async (req, res) => {
  const {
      tipo_norma,
      denominacion_norma,
      flag_adjunto,
      creado_por,
      creado_fecha
  } = req.body;

  const pdfFile = req.file;

  try {
      // Crear una instancia de Norma con las propiedades proporcionadas
      const nuevaNorma = await Norma.create({
          tipo_norma,
          denominacion_norma,
          creado_por,
          creado_fecha,
          flag_adjunto
      });

      // Verificar si se proporcionó un archivo adjunto
      if (pdfFile) {
          // Obtener información del archivo y definir rutas
          const __dirname = path.dirname(fileURLToPath(import.meta.url));
          const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'normas');
          const fileNameParts = pdfFile.originalname.split('.');
          const fileExtension = fileNameParts.pop();
          const baseFileName = fileNameParts.join('.');
          const safeFileName = `${slugify(baseFileName, { lower: true, strict: true })}.${fileExtension}`;
          const filePath = path.join(documentosDir, safeFileName);

          // Manejar la lógica según el tipo de adjunto (URL o BIN)
          if (flag_adjunto === 'URL') {
              // Crear el directorio si no existe y copiar el archivo
              await fs.mkdir(documentosDir, { recursive: true });
              await fs.copyFile(pdfFile.path, filePath);
              
              // Actualizar las propiedades de la Norma
              nuevaNorma.url_documento = `${baseUrl}/documentos/normas/${safeFileName}`;
              nuevaNorma.contenido_documento = null;
          } else if (flag_adjunto === 'BIN') {
              // Leer el contenido del archivo
              nuevaNorma.contenido_documento = await fs.readFile(pdfFile.path);
              nuevaNorma.url_documento = null;
          }
      }

      // Guardar los cambios en la base de datos
      await nuevaNorma.save();

      // Responder con un mensaje de éxito
      return res.status(201).json({ mensaje: 'Grabación satisfactoria', nuevaNorma });
  } catch (error) {
      // Manejar errores y responder con un mensaje de error
      console.error(error);
      return res.status(500).json({ mensaje: 'Error al crear norma', error: error.message });
  }
};


export const actualizarNorma = async (req, res) => {
  const { id } = req.params;
  const {
      tipo_norma,
      denominacion_norma,
      flag_adjunto,
      modificado_por,
      modificado_fecha,
      activo
  } = req.body;

  const pdfFile = req.file;

  try {
      // Buscar la norma por su ID
      const norma = await Norma.findByPk(id);

      // Verificar si la norma existe
      if (!norma) {
          return res.status(404).json({ mensaje: 'Norma no encontrada' });
      }

      // Verificar el tamaño del archivo adjunto
      if (pdfFile && pdfFile.size > 10000000) {
          return res.status(400).json({ mensaje: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
      }

      // Actualizar las propiedades de la norma
      norma.tipo_norma = tipo_norma;
      norma.denominacion_norma = denominacion_norma;
      norma.modificado_por = modificado_por;
      norma.modificado_fecha = modificado_fecha;
      norma.activo = activo;

      // Manejar la lógica según el tipo de adjunto (URL o BIN)
      if (pdfFile) {
          const __dirname = path.dirname(fileURLToPath(import.meta.url));
          const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'normas');
          const fileNameParts = pdfFile.originalname.split('.');
          const fileExtension = fileNameParts.pop();
          const baseFileName = fileNameParts.join('.');
          const safeFileName = `${slugify(baseFileName, { lower: true, strict: true })}.${fileExtension}`;
          const filePath = path.join(documentosDir, safeFileName);

          if (flag_adjunto === 'URL') {
              // Crear el directorio si no existe y copiar el archivo
              await fs.mkdir(documentosDir, { recursive: true });
              await fs.copyFile(pdfFile.path, filePath);
              
              // Actualizar las propiedades de la Norma
              norma.url_documento = `${baseUrl}/documentos/normas/${safeFileName}`;
              norma.contenido_documento = null;
              norma.flag_adjunto = 'URL';
          } else if (flag_adjunto === 'BIN') {
              // Leer el contenido del archivo
              norma.url_documento = null;
              norma.contenido_documento = await fs.readFile(pdfFile.path);
              norma.flag_adjunto = 'BIN';
          }
      }

      // Guardar los cambios en la base de datos
      await norma.save();

      // Responder con un mensaje de éxito
      return res.status(200).json({ mensaje: 'Actualización realizada con éxito', norma });
  } catch (error) {
      // Manejar errores y responder con un mensaje de error
      console.error(error);
      return res.status(500).json({ mensaje: 'Error al modificar norma', error: error.message });
  }
};



export const autorizarNorma = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try{
  const norma = await Norma.findByPk(id);
  norma.autorizado = autorizado;
  norma.autorizado_por = autorizado_por;
  norma.autorizado_fecha = autorizado_fecha;
  await norma.save(); 
  res.send('Norma autorizada / desautorizada');
  }
  catch(error){
       return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarNorma = async (req, res) =>{

    try {
        const { id } = req.params
        await Norma.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarNorma = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const norma = await Norma.findByPk(id);
  
      if (!norma) {
        return res.status(404).json({ mensaje: 'Norma no encontrada' });
      }
  
      norma.activo = '1'; // Establecer activo en '1'
      await norma.save();
  
      res.json({ mensaje: 'Norma activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarNorma = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const norma = await Norma.findByPk(id);
  
      if (!norma) {
        return res.status(404).json({ mensaje: 'Norma no encontrada' });
      }
  
      norma.activo = '0'; // Establecer activo en '0'
      await norma.save();
  
      res.json({ mensaje: 'Norma desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
