import { Sequelize } from 'sequelize';
import { Resolucion } from '../models/Resolucion.js';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
const baseUrl = process.env.BASE_URL; 


export const obtenerPeriodos = async (req, res) => {
  try {
    const aniosUnicos = await Resolucion.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('periodo_resolucion')), 'periodo_resolucion'],
      ],
      order: [[Sequelize.col('periodo_resolucion'), 'DESC']],
    });

    // Extraer los valores de aniosUnicos
    const anios = aniosUnicos.map((anio) => anio.get('periodo_resolucion'));

    res.json(anios);
  } catch (error) {
    console.error('Error al obtener años únicos de resoluciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const leerResoluciones = async (req, res) =>{
    try {
        const resoluciones = await Resolucion.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(resoluciones);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const buscarResoluciones = async (req, res) => {
    const { periodo_resolucion, id_area, id_tipo_documento, numero_resolucion, sumilla_resolucion, autorizado, activo } = req.query;
  
    try {
      const whereClause = {};
  
      if (periodo_resolucion) {
        whereClause.periodo_resolucion = periodo_resolucion;
      }
  
      if (autorizado) {
        whereClause.autorizado = autorizado;
      }

      if (id_area) {
        whereClause.id_area = id_area;
      }
  
      if (id_tipo_documento) {
        whereClause.id_tipo_documento = id_tipo_documento;
      }
  
      if (numero_resolucion) {
        whereClause.numero_resolucion = numero_resolucion;
      }
  
      if (sumilla_resolucion) {
        whereClause.sumilla_resolucion = {
          [Sequelize.Op.like]: `%${sumilla_resolucion}%`
        };
      }
  
      if (activo) {
        whereClause.activo = activo;
      }
      
      const resoluciones = await Resolucion.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause,
        order: [
          ['periodo_resolucion', 'DESC'],
          ['id_area', 'DESC'],
          ['numero_resolucion', 'DESC']
        ]
      });
  
      res.json(resoluciones);
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

export const leerResolucion = async (req, res) =>{
    const { id } = req.params;
    try {
        const resolucion = await Resolucion.findOne({
            where:{
                id
            }
        })
        res.json(resolucion);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}


export const crearResolucion = async (req, res) => {
    const {
        periodo_resolucion,
        id_area,
        id_tipo_documento,
        numero_resolucion,
        adicional_resolucion,
        sumilla_resolucion,
        abreviacion_area,
        creado_por,
        creado_fecha,
        flag_adjunto
    } = req.body;

    const pdfFile = req.file;

    try {
        if (!pdfFile) {
            return res.status(400).json({ mensaje: 'No se ha proporcionado un archivo PDF' });
        }

        if (pdfFile.size > 10000000) { // 10 MB en bytes
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        if (!pdfFile.mimetype.includes("pdf")) {
            return res.status(400).json({ message: 'Tipo de archivo no permitido. Solo se aceptan archivos PDF.' });
        }

        if (flag_adjunto !== 'URL' && flag_adjunto !== 'BIN') {
            return res.status(400).json({ mensaje: 'El valor de flag_adjunto no es válido' });
        }

        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'resoluciones');
        const fileNameParts = pdfFile.originalname.split('.');
        const fileExtension = fileNameParts.pop();
        const baseFileName = fileNameParts.join('.');
        const safeFileName = `${slugify(baseFileName, { lower: true, strict: true })}.${fileExtension}`;
        const filePath = path.join(documentosDir, safeFileName);

        let url_documento_resolucion = null;
        let contenido_documento_resolucion = null;

        if (flag_adjunto === 'URL') {
            await fs.mkdir(documentosDir, { recursive: true });
            await fs.copyFile(pdfFile.path, filePath);
            url_documento_resolucion = `${baseUrl}/documentos/resoluciones/${safeFileName}`;
        } else if (flag_adjunto === 'BIN') {
            contenido_documento_resolucion = await fs.readFile(pdfFile.path);
        }

        const nuevaResolucion = await Resolucion.create({
            periodo_resolucion,
            id_area,
            id_tipo_documento,
            numero_resolucion,
            adicional_resolucion,
            sumilla_resolucion,
            abreviacion_area,
            creado_por,
            creado_fecha,
            flag_adjunto,
            url_documento_resolucion,
            contenido_documento_resolucion
        });

        return res.status(201).json({ mensaje: 'Resolución creada con éxito', nuevaResolucion });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear resolución', error: error.message });
    }
};


export const actualizarResolucion = async (req, res) => {
    const { id } = req.params;
    const {
        periodo_resolucion,
        id_area,
        id_tipo_documento,
        numero_resolucion,
        adicional_resolucion,
        sumilla_resolucion,
        abreviacion_area,
        modificado_por,
        modificado_fecha,
        activo,
        flag_adjunto
    } = req.body;

    try {
        const resolucion = await Resolucion.findByPk(id);
        if (!resolucion) {
            return res.status(404).json({ mensaje: 'Resolución no encontrada' });
        }

        resolucion.periodo_resolucion = periodo_resolucion;
        resolucion.id_area = id_area;
        resolucion.id_tipo_documento = id_tipo_documento;
        resolucion.numero_resolucion = numero_resolucion;
        resolucion.adicional_resolucion = adicional_resolucion;
        resolucion.sumilla_resolucion = sumilla_resolucion;
        resolucion.abreviacion_area = abreviacion_area;
        resolucion.modificado_por = modificado_por;
        resolucion.modificado_fecha = modificado_fecha;
        resolucion.activo = activo;

        if (req.file) {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'resoluciones');
            const fileNameParts = req.file.originalname.split('.');
            const fileExtension = fileNameParts.pop();
            const baseFileName = fileNameParts.join('.');
            const safeFileName = `${slugify(baseFileName, { lower: true, strict: true })}.${fileExtension}`;
            const filePath = path.join(documentosDir, safeFileName);

            if (flag_adjunto === 'URL') {
                await fs.mkdir(documentosDir, { recursive: true });
                await fs.copyFile(req.file.path, filePath);
                resolucion.url_documento_resolucion = `${baseUrl}/documentos/resoluciones/${safeFileName}`;
                resolucion.contenido_documento_resolucion = null;
            } else if (flag_adjunto === 'BIN') {
                resolucion.url_documento_resolucion = null;
                resolucion.contenido_documento_resolucion = await fs.readFile(req.file.path);
            }
        }

        await resolucion.save();
        return res.json({ mensaje: 'Resolución actualizada con éxito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al modificar resolución', error: error.message });
    }
};


export const autorizarResolucion = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try {
      const resolucion = await Resolucion.findByPk(id);
      resolucion.autorizado = autorizado;
      resolucion.autorizado_por = autorizado_por;
      resolucion.autorizado_fecha = autorizado_fecha;
      await resolucion.save(); 
      res.send('Resolución autorizada / desautorizada');
  }
  catch(error){
      return res.status(500).json({ mensaje: error.message })
  }
}


export const eliminarResolucion = async (req, res) =>{

    try {
        const { id } = req.params
        await Resolucion.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarResolucion = async (req, res) => {
  try {
    const { id } = req.params; 

    const resolucion = await Resolucion.findByPk(id);

    if (!resolucion) {
      return res.status(404).json({ mensaje: 'Resolucion no encontrada' });
    }

    resolucion.activo = '1'; // Establecer activo en '1'
    await resolucion.save();

    res.json({ mensaje: 'Resolucion activada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const desactivarResolucion = async (req, res) => {
  try {
    const { id } = req.params; 

    const resolucion = await Resolucion.findByPk(id);

    if (!resolucion) {
      return res.status(404).json({ mensaje: 'Resolucion no encontrada' });
    }

    resolucion.activo = '0'; // Establecer activo en '0'
    await resolucion.save();

    res.json({ mensaje: 'Resolucion desactivada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};
