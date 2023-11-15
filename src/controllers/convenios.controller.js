import { Sequelize } from 'sequelize';
import {Convenio} from '../models/Convenio.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

import dotenv from 'dotenv';
const baseUrl = process.env.BASE_URL; 
import slugify from 'slugify';

export const obtenerPeriodos = async (req, res) => {
  try {
    const aniosUnicos = await Convenio.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('periodo_convenio')), 'periodo_convenio'],
      ],
      order: [[Sequelize.col('periodo_convenio'), 'DESC']],
    });

    // Extraer los valores de aniosUnicos
    const anios = aniosUnicos.map((anio) => anio.get('periodo_convenio'));

    res.json(anios);
  } catch (error) {
    console.error('Error al obtener años únicos de convenios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const leerConvenios = async (req, res) =>{
    try {
        const convenios = await Convenio.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(convenios);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarConvenios = async (req, res) => {
  const { descripcion_convenio, periodo_convenio, periodo_mes, id_departamento, id_provincia, id_distrito, autorizado, activo } = req.query;

  try {
    const whereClause = {};

    if (descripcion_convenio) {
      whereClause.descripcion_convenio = {
        [Sequelize.Op.like]: `%${descripcion_convenio}%`
      };
    }

    if (autorizado) {
      whereClause.autorizado = autorizado;
    }

    if (periodo_convenio) {
      whereClause.periodo_convenio = periodo_convenio;
    }

    if (periodo_mes) {
      whereClause.periodo_mes = periodo_mes;
    }

    if (id_departamento) {
      whereClause.id_departamento = id_departamento;
    }

    if (id_provincia) {
      whereClause.id_provincia = id_provincia;
    }

    if (id_distrito) {
      whereClause.id_distrito = id_distrito;
    }

    const convenios = await Convenio.findAll({
      where: whereClause,
      order: [['fecha_convenio', 'DESC']], 
    });

    // Transformar los resultados para cambiar el orden de los campos
    const resultadoTransformado = convenios.map(convenio => ({
      id: convenio.id,
      descripcion_convenio: convenio.descripcion_convenio,
      flag_adjunto: convenio.flag_adjunto,
      id_departamento: convenio.id_departamento,
      id_provincia: convenio.id_provincia,
      id_distrito: convenio.id_distrito,
      url_documento: convenio.url_documento,
      contenido_documento: convenio.contenido_documento,
      fecha_convenio: convenio.fecha_convenio,
      periodo_convenio: convenio.periodo_convenio,
      periodo_mes: convenio.periodo_mes,
      creado_por: convenio.creado_por,
      creado_fecha: convenio.creado_fecha,
      modificado_por: convenio.modificado_por,
      modificado_fecha: convenio.modificado_fecha,
      autorizado: convenio.autorizado,
      autorizado_por: convenio.autorizado_por,
      autorizado_fecha: convenio.autorizado_fecha,
      activo: convenio.activo,
    }));

    res.json(resultadoTransformado);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

  

export const leerConvenio = async (req, res) =>{
    const { id } = req.params;
    try {
        const convenio = await Convenio.findOne({
            where:{
                id
            }
        })
        res.json(convenio);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


export const crearConvenio = async (req, res) => {
  const {
      descripcion_convenio,
      fecha_convenio,
      creado_por,
      creado_fecha,
      id_departamento,
      id_provincia,
      id_distrito,
      flag_adjunto
  } = req.body;

  const pdfFile = req.file;

  try {
      let url_documento = null;
      let contenido_documento = null;

      // Validar el tamaño del archivo adjunto
      if (pdfFile && pdfFile.size > 10000000) {
          return res.status(400).json({ mensaje: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
      }

      // Manejar la lógica según el tipo de adjunto (URL o BIN)
      if (flag_adjunto === 'URL' && pdfFile) {
          const __dirname = path.dirname(fileURLToPath(import.meta.url));
          const documentosDir = path.join(__dirname, 'documentos', 'convenios');
          const originalFileName = pdfFile.originalname;
          const filePath = path.join(documentosDir, originalFileName);

          // Crear el directorio si no existe y copiar el archivo
          await fs.mkdir(documentosDir, { recursive: true });
          await fs.copyFile(pdfFile.path, filePath);
          url_documento = `${baseUrl}/documentos/convenios/${originalFileName}`;
      } else if (flag_adjunto === 'BIN' && pdfFile) {
          // Leer el contenido del archivo
          contenido_documento = await fs.readFile(pdfFile.path);
      }

      
      // Crear un nuevo convenio en la base de datos, permitiendo valores nulos para id_provincia e id_distrito
      const nuevoConvenio = await Convenio.create({
          descripcion_convenio,
          fecha_convenio,
          creado_por,
          creado_fecha,
          id_departamento,
          id_provincia: id_provincia || null,
          id_distrito: id_distrito || null,
          flag_adjunto,
          url_documento,
          contenido_documento
      });

      // Responder con el nuevo convenio creado
      return res.status(201).json({ mensaje: 'Convenio creado con éxito', nuevoConvenio });
  } catch (error) {
      // Manejar errores y responder con un mensaje de error
      console.error(error);
      return res.status(500).json({ mensaje: 'Error al crear convenio', error: error.message });
  }
};


export const autorizarConvenio = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try{
  const convenio = await Convenio.findByPk(id);
  
  convenio.autorizado = autorizado;
  convenio.autorizado_por = autorizado_por;
  convenio.autorizado_fecha = autorizado_fecha;
  await convenio.save(); 
  res.send('Convenio autorizado/desautorizado');
  }
  catch(error){
       return res.status(500).json({ mensaje: error.message })
  }
}


export const eliminarConvenio = async (req, res) => {
    try {
        const { id } = req.params;
        await Convenio.destroy({
            where: {
                id,
            },
        });
        res.status(204).json({ mensaje: 'Convenio eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
};


export const activarConvenio = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convenio = await Convenio.findByPk(id);
  
      if (!convenio) {
        return res.status(404).json({ mensaje: 'Convenio no encontrada' });
      }
  
      convenio.activo = '1'; // Establecer activo en '1'
      await convenio.save();
  
      res.json({ mensaje: 'Convenio activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarConvenio = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convenio = await Convenio.findByPk(id);
  
      if (!convenio) {
        return res.status(404).json({ mensaje: 'Convenio no encontrado' });
      }
  
      convenio.activo = '0'; // Establecer activo en '0'
      await convenio.save();
  
      res.json({ mensaje: 'Convenio desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };

  const guardarArchivo = async (entidadDir, pdfFile) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const documentosDir = path.join(__dirname, 'documentos', entidadDir);
    const originalFileName = pdfFile.originalname;
    const filePath = path.join(documentosDir, originalFileName);
  
    await fs.mkdir(documentosDir, { recursive: true });
    await fs.copyFile(pdfFile.path, filePath);
  
    return `${baseUrl}/documentos/${entidadDir}/${originalFileName}`;
  };
  
  
  export const actualizarConvenio = async (req, res) => {
    const { id } = req.params;
    const { descripcion_convenio,
      fecha_convenio,
      id_departamento,
      id_provincia,
      id_distrito,
      flag_adjunto, 
      modificado_por,
      modificado_fecha  
     } = req.body;

    const pdfFile = req.file;

    console.log(pdfFile);
  
    try {
        // Validar el tamaño del archivo adjunto
        if (pdfFile && pdfFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }
  
        let url_documento = null;
        let contenido_documento = null;
  
        // Manejar la lógica según el tipo de adjunto (URL o BIN)
        if (pdfFile) {
            if (flag_adjunto === 'URL') {
                url_documento = await guardarArchivo('convenios', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }
  
        // Actualizar el convenio en la base de datos
        const convenioActualizado = await Convenio.update(
            {
                descripcion_convenio,
                fecha_convenio,
                id_departamento,
                id_provincia,
                id_distrito,
                flag_adjunto,
                url_documento,
                contenido_documento,
                modificado_por,
                modificado_fecha          },
            {
                where: { id },
            }
        );
  
        if (convenioActualizado[0] === 0) {
            return res.status(404).json({ mensaje: 'No se encontró el convenio con el ID proporcionado' });
        }
  
        // Obtener el convenio actualizado después de la operación de actualización
        const convenio = await Convenio.findByPk(id);
  
        // Responder con el convenio actualizado
        return res.json({ mensaje: 'Convenio actualizado con éxito', convenio });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar convenio', error: error.message });
    }
  };