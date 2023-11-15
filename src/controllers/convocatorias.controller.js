import { Sequelize } from 'sequelize';
import {Convocatoria} from '../models/Convocatoria.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

export const obtenerPeriodos = async (req, res) => {
  try {
    const aniosUnicos = await Convocatoria.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('periodo_convocatoria')), 'periodo_convocatoria'],
      ],
      order: [[Sequelize.col('periodo_convocatoria'), 'DESC']],
    });

    // Extraer los valores de aniosUnicos
    const anios = aniosUnicos.map((anio) => anio.get('periodo_convocatoria'));

    res.json(anios);
  } catch (error) {
    console.error('Error al obtener años únicos de convocatorias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const buscarConvocatorias = async (req, res) => {
    const { tipo_convocatoria, numero_convocatoria, periodo_convocatoria, estado_convocatoria, descripcion_convocatoria, id_area, autorizado, activo } = req.query;
  
    try {
      const whereClause = {};
  
      if (tipo_convocatoria) {
        whereClause.tipo_convocatoria = tipo_convocatoria;
      }
      
      if (autorizado) {
        whereClause.autorizado = autorizado;
      }

      if (id_area) {
        whereClause.id_area = id_area;
      }
  
      if (numero_convocatoria) {
        whereClause.numero_convocatoria = numero_convocatoria;
      }
  
      if (periodo_convocatoria) {
        whereClause.periodo_convocatoria = periodo_convocatoria;
      }
  
      if (estado_convocatoria) {
        whereClause.estado_convocatoria = estado_convocatoria;
      }
  
      if (descripcion_convocatoria) {
        whereClause.descripcion_convocatoria = {
          [Sequelize.Op.like]: `%${descripcion_convocatoria}%`
        };
      }

      if (activo) {
        whereClause.activo = activo;
      }
  
      const convocatorias = await Convocatoria.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause,
        order: [
          ['periodo_convocatoria', 'DESC'],
          ['numero_convocatoria', 'DESC']
        ]
      });
  
      res.json(convocatorias);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  



export const leerConvocatorias = async (req, res) =>{
    try {
        const convocatorias = await Convocatoria.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(convocatorias);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const activarConvocatoria = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convocatoria = await Convocatoria.findByPk(id);
  
      if (!convocatoria) {
        return res.status(404).json({ mensaje: 'Convocatoria no encontrada' });
      }
  
      convocatoria.activo = '1'; // Establecer activo en '1'
      await convocatoria.save();
  
      res.json({ mensaje: 'Convocatoria activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarConvocatoria = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convocatoria = await Convocatoria.findByPk(id);
  
      if (!convocatoria) {
        return res.status(404).json({ mensaje: 'Convocatoria no encontrada' });
      }
  
      convocatoria.activo = '0'; // Establecer activo en '0'
      await convocatoria.save();
  
      res.json({ mensaje: 'Convocatoria desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };


export const leerConvocatoria = async (req, res) =>{
    const { id } = req.params;
    try {
        const convocatoria = await Convocatoria.findOne({
            where:{
                id
            }
        })
        res.json(convocatoria);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearConvocatoria = async (req, res) => {
    const {
      descripcion_convocatoria,
      tipo_convocatoria,
      numero_convocatoria,
      periodo_convocatoria,
      creado_por,
      creado_fecha,
      flag_adjunto,
      pdfFile1,
      pdfFile2,
      pdfFile3,
      pdfFile4,
      pdfFile5,
      pdfFile6,
      pdfFile7,
      pdfFile8,
      pdfFile9,
      pdfFile10,
  } = req.body;

    try {
        // Validar si se han enviado archivos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ mensaje: 'Debes adjuntar al menos un archivo' });
        }

        // Procesar y guardar archivos según el tipo de adjunto
        const archivosGuardados = await Promise.all(req.files.map(async (archivo) => {
            const { originalname, buffer } = archivo;

            // Crear el directorio si no existe
            const documentosDir = path.join(__dirname, '..', 'documentos', 'convocatorias');
            await fs.mkdir(documentosDir, { recursive: true });

            // Crear la ruta completa del archivo
            const filePath = path.join(documentosDir, originalname);

            // Guardar el archivo en el sistema de archivos
            await fs.writeFile(filePath, buffer);

            // Devolver la URL o el contenido según el tipo de adjunto
            return {
                nombreCampo: originalname, // Nombre del campo en tu modelo
                valor: flag_adjunto === 'URL' ? `${baseUrl}/documentos/convocatorias/${originalname}` : buffer,
            };
        }));

        // Crear un nuevo registro de convocatoria en la base de datos
        const nuevaConvocatoria = await Convocatoria.create({
          descripcion_convocatoria,
          tipo_convocatoria,
          numero_convocatoria,
          periodo_convocatoria,
          creado_por,
          creado_fecha,
          flag_adjunto,
          url_anexos: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile1')?.valor || null,
          url_comunicacion1: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile2')?.valor || null,
          url_comunicacion2: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile3')?.valor || null,
          url_comunicacion3: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile4')?.valor || null,
          url_comunicaciones: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile5')?.valor || null,
          url_aviso: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile6')?.valor || null,
          url_resultado_evaluacion_curricular: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile7')?.valor || null,
          url_resultado_examen: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile8')?.valor || null,
          contenido_anexos: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile1')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile1')?.valor,
          contenido_comunicacion1: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile2')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile2')?.valor,
          contenido_comunicacion2: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile3')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile3')?.valor,
          contenido_comunicacion3: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile4')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile4')?.valor,
          contenido_comunicaciones: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile5')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile5')?.valor,
          contenido_aviso: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile6')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile6')?.valor,
          contenido_resultado_evaluacion_curricular: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile7')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile7')?.valor,
          contenido_resultado_examen: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile8')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile8')?.valor,
      });
      

        return res.status(201).json({ mensaje: 'Convocatoria creada con éxito', nuevaConvocatoria });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear convocatoria', error: error.message });
    }
};

export const actualizarConvocatoria = async (req, res) => {
  const {
    descripcion_convocatoria,
    tipo_convocatoria,
    numero_convocatoria,
    periodo_convocatoria,
    flag_adjunto,
    modificado_por,
    modificado_fecha,
    pdfFile1,
    pdfFile2,
    pdfFile3,
    pdfFile4,
    pdfFile5,
    pdfFile6,
    pdfFile7,
    pdfFile8,
    pdfFile9,
    pdfFile10,
} = req.body;

  try {
      // Validar si se han enviado archivos
      if (!req.files || req.files.length === 0) {
          return res.status(400).json({ mensaje: 'Debes adjuntar al menos un archivo' });
      }

      // Procesar y guardar archivos según el tipo de adjunto
      const archivosGuardados = await Promise.all(req.files.map(async (archivo) => {
          const { originalname, buffer } = archivo;

          // Crear el directorio si no existe
          const documentosDir = path.join(__dirname, '..', 'documentos', 'convocatorias');
          await fs.mkdir(documentosDir, { recursive: true });

          // Crear la ruta completa del archivo
          const filePath = path.join(documentosDir, originalname);

          // Guardar el archivo en el sistema de archivos
          await fs.writeFile(filePath, buffer);

          // Devolver la URL o el contenido según el tipo de adjunto
          return {
              nombreCampo: originalname, // Nombre del campo en tu modelo
              valor: flag_adjunto === 'URL' ? `${baseUrl}/documentos/convocatorias/${originalname}` : buffer,
          };
      }));

      // Crear un nuevo registro de convocatoria en la base de datos
      const nuevaConvocatoria = await Convocatoria.create({
        descripcion_convocatoria,
        tipo_convocatoria,
        numero_convocatoria,
        periodo_convocatoria,
        modificado_por,
        modificado_fecha,
        flag_adjunto,
        url_anexos: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile1')?.valor || null,
        url_comunicacion1: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile2')?.valor || null,
        url_comunicacion2: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile3')?.valor || null,
        url_comunicacion3: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile4')?.valor || null,
        url_comunicaciones: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile5')?.valor || null,
        url_aviso: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile6')?.valor || null,
        url_resultado_evaluacion_curricular: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile7')?.valor || null,
        url_resultado_examen: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile8')?.valor || null,
        contenido_anexos: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile1')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile1')?.valor,
        contenido_comunicacion1: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile2')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile2')?.valor,
        contenido_comunicacion2: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile3')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile3')?.valor,
        contenido_comunicacion3: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile4')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile4')?.valor,
        contenido_comunicaciones: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile5')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile5')?.valor,
        contenido_aviso: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile6')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile6')?.valor,
        contenido_resultado_evaluacion_curricular: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile7')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile7')?.valor,
        contenido_resultado_examen: archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile8')?.nombreCampo === 'pdfFile' ? null : archivosGuardados.find((archivo) => archivo.nombreCampo === 'pdfFile8')?.valor,
    });
    

      return res.status(201).json({ mensaje: 'Convocatoria creada con éxito', nuevaConvocatoria });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ mensaje: 'Error al crear convocatoria', error: error.message });
  }
};
export const autorizarConvocatoria = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try {

      const convocatoria = await Convocatoria.findByPk(id);
      
      convocatoria.autorizado = autorizado;
      convocatoria.autorizado_por = autorizado_por;
      convocatoria.autorizado_fecha = autorizado_fecha;
      await convocatoria.save(); 
      
      res.send('Convocatoria autorizada / desautorizada');
  }
  catch(error){
      return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarConvocatoria = async (req, res) =>{

    try {
        const { id } = req.params
        await Convocatoria.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
}

