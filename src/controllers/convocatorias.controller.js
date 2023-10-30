import { Sequelize } from 'sequelize';
import {Convocatoria} from '../models/Convocatoria.js';
import fs from 'fs';
import multer from 'multer';

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
        id_area,
        tipo_convocatoria,
        numero_convocatoria,
        periodo_convocatoria,
        estado_convocatoria,
        creado_por,
        creado_fecha,
        flag_adjunto
    } = req.body;

    const {
        anexosUrl,
        comunicacion1Url,
        comunicacion2Url,
        comunicacion3Url,
        comunicacionesUrl,
        avisoUrl,
        resultado_evaluacion_curricularUrl,
        resultado_examenUrl,
        resultado_entrevistaUrl,
        puntaje_finalUrl,
        anexosFile,
        comunicacion1File,
        comunicacion2File,
        comunicacion3File,
        comunicacionesFile,
        avisoFile,
        resultado_evaluacion_curricularFile,
        resultado_examenFile,
        resultado_entrevistaFile,
        puntaje_finalFile
    } = req.files;

    const generarNombreUnico = (archivo) => {
        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const nombreArchivo = archivo.originalname.replace(/\s+/g, '_');
        return `${nombreArchivo}_${uniqueSuffix}`;
    };

    const urls = {};

    if (flag_adjunto === 'URL') {
        const camposUrl = ['anexosUrl', 'comunicacion1Url', 'comunicacion2Url', 'comunicacion3Url', 'comunicacionesUrl', 'avisoUrl', 'resultado_evaluacion_curricularUrl', 'resultado_examenUrl', 'resultado_entrevistaUrl', 'puntaje_finalUrl'];

        camposUrl.forEach((campo) => {
            if (req.files[campo]) {
                urls[campo] = `\\convocatorias\\${generarNombreUnico(req.files[campo][0])}`;
            }
        });
    }

    const contenidoBinario = {};

    if (flag_adjunto === 'BIN') {
        const camposBinarios = ['anexosFile', 'comunicacion1File', 'comunicacion2File', 'comunicacion3File', 'comunicacionesFile', 'avisoFile', 'resultado_evaluacion_curricularFile', 'resultado_examenFile', 'resultado_entrevistaFile', 'puntaje_finalFile'];

        camposBinarios.forEach((campo) => {
            if (req.files[campo]) {
                contenidoBinario[campo] = fs.readFileSync(req.files[campo][0].path);
            }
        });
    }

    try {
        const nuevaConvocatoria = await Convocatoria.create({
            descripcion_convocatoria,
            id_area,
            tipo_convocatoria,
            numero_convocatoria,
            periodo_convocatoria,
            estado_convocatoria,
            creado_por,
            creado_fecha,
            url_anexos: urls.anexosUrl || null,
            url_comunicacion1: urls.comunicacion1Url || null,
            url_comunicacion2: urls.comunicacion2Url || null,
            url_comunicacion3: urls.comunicacion3Url || null,
            url_comunicaciones: urls.comunicacionesUrl || null,
            url_aviso: urls.avisoUrl || null,
            url_resultado_evaluacion_curricular: urls.resultado_evaluacion_curricularUrl || null,
            url_resultado_examen: urls.resultado_examenUrl || null,
            url_resultado_entrevista: urls.resultado_entrevistaUrl || null,
            url_puntaje_final: urls.puntaje_finalUrl || null,
            contenido_anexos: contenidoBinario.anexosFile || null,
            contenido_comunicacion1: contenidoBinario.comunicacion1File || null,
            contenido_comunicacion2: contenidoBinario.comunicacion2File || null,
            contenido_comunicacion3: contenidoBinario.comunicacion3File || null,
            contenido_comunicaciones: contenidoBinario.comunicacionesFile || null,
            contenido_aviso: contenidoBinario.avisoFile || null,
            contenido_resultado_evaluacion_curricular: contenidoBinario.resultado_evaluacion_curricularFile || null,
            contenido_resultado_examen: contenidoBinario.resultado_examenFile || null,
            contenido_resultado_entrevista: contenidoBinario.resultado_entrevistaFile || null,
            contenido_puntaje_final: contenidoBinario.puntaje_finalFile || null,
        });

        const archivosTemporales = ['anexosFile', 'comunicacion1File', 'comunicacion2File', 'comunicacion3File', 'comunicacionesFile', 'avisoFile', 'resultado_evaluacion_curricularFile', 'resultado_examenFile', 'resultado_entrevistaFile', 'puntaje_finalFile'];

        archivosTemporales.forEach((campo) => {
            if (req.files[campo] && req.files[campo].length > 0) {
                fs.unlinkSync(req.files[campo][0].path);
            }
        });

        res.status(201).json(nuevaConvocatoria);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la convocatoria' });
    }
};


export const actualizarConvocatoria = async (req, res) => {
    const { id } = req.params;
    const {
        descripcion_convocatoria,
        id_area,
        tipo_convocatoria,
        numero_convocatoria,
        periodo_convocatoria,
        estado_convocatoria,
        modificado_por,
        modificado_fecha,
        activo,
        flag_adjunto
    } = req.body;

    const {
        anexosUrl,
        comunicacion1Url,
        comunicacion2Url,
        comunicacion3Url,
        comunicacionesUrl,
        avisoUrl,
        resultado_evaluacion_curricularUrl,
        resultado_examenUrl,
        resultado_entrevistaUrl,
        puntaje_finalUrl,
        
        anexosFile,
        comunicacion1File,
        comunicacion2File,
        comunicacion3File,
        comunicacionesFile,
        avisoFile,
        resultado_evaluacion_curricularFile,
        resultado_examenFile,
        resultado_entrevistaFile,
        puntaje_finalFile
    } = req.files;

    const generarNombreUnico = (archivo) => {
        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const nombreArchivo = archivo.originalname.replace(/\s+/g, '_');
        return `${nombreArchivo}_${uniqueSuffix}`;
    };

    const urls = {};

    if (flag_adjunto === 'URL') {
        const camposUrl = ['anexosUrl', 'comunicacion1Url', 'comunicacion2Url', 'comunicacion3Url', 'comunicacionesUrl', 'avisoUrl', 'resultado_evaluacion_curricularUrl', 'resultado_examenUrl', 'resultado_entrevistaUrl', 'puntaje_finalUrl'];

        camposUrl.forEach((campo) => {
            if (req.files[campo]) {
                urls[campo] = `\\convocatorias\\${generarNombreUnico(req.files[campo][0])}`;
            }
        });
    }

    const contenidoBinario = {};

    if (flag_adjunto === 'BIN') {
        const camposBinarios = ['anexosFile', 'comunicacion1File', 'comunicacion2File', 'comunicacion3File', 'comunicacionesFile', 'avisoFile', 'resultado_evaluacion_curricularFile', 'resultado_examenFile', 'resultado_entrevistaFile', 'puntaje_finalFile'];

        camposBinarios.forEach((campo) => {
            if (req.files[campo]) {
                contenidoBinario[campo] = fs.readFileSync(req.files[campo][0].path);
            }
        });
    }

    try {
        const convocatoria = await Convocatoria.findByPk(id);

        if (!convocatoria) {
            return res.status(404).json({ mensaje: 'Convocatoria no encontrada' });
        }

        convocatoria.descripcion_convocatoria = descripcion_convocatoria;
        convocatoria.id_area = id_area;
        convocatoria.tipo_convocatoria = tipo_convocatoria;
        convocatoria.numero_convocatoria = numero_convocatoria;
        convocatoria.periodo_convocatoria = periodo_convocatoria;
        convocatoria.estado_convocatoria = estado_convocatoria;
        convocatoria.modificado_por = modificado_por;
        convocatoria.modificado_fecha = modificado_fecha;
        convocatoria.autorizado = '0';
        convocatoria.autorizado_por = null;
        convocatoria.autorizado_fecha = null;
        convocatoria.activo = activo;

        if (flag_adjunto === 'URL') {
            // Actualiza las URLs desde los archivos
            convocatoria.url_anexos = urls.anexosUrl || null;
            convocatoria.url_comunicacion1 = urls.comunicacion1Url || null;
            convocatoria.url_comunicacion2 = urls.comunicacion2Url || null;
            convocatoria.url_comunicacion3 = urls.comunicacion3Url || null;
            convocatoria.url_comunicaciones = urls.comunicacionesUrl || null;
            convocatoria.url_aviso = urls.avisoUrl || null;
            convocatoria.url_resultado_evaluacion_curricular = urls.resultado_evaluacion_curricularUrl || null;
            convocatoria.url_resultado_examen = urls.resultado_examenUrl || null;
            convocatoria.url_resultado_entrevista = urls.resultado_entrevistaUrl || null;
            convocatoria.url_puntaje_final = urls.puntaje_finalUrl || null;
        } else if (flag_adjunto === 'BIN') {
            // Actualiza el contenido binario desde los archivos
            convocatoria.contenido_anexos = contenidoBinario.anexosFile || null;
            convocatoria.contenido_comunicacion1 = contenidoBinario.comunicacion1File || null;
            convocatoria.contenido_comunicacion2 = contenidoBinario.comunicacion2File || null;
            convocatoria.contenido_comunicacion3 = contenidoBinario.comunicacion3File || null;
            convocatoria.contenido_comunicaciones = contenidoBinario.comunicacionesFile || null;
            convocatoria.contenido_aviso = contenidoBinario.avisoFile || null;
            convocatoria.contenido_resultado_evaluacion_curricular = contenidoBinario.resultado_evaluacion_curricularFile || null;
            convocatoria.contenido_resultado_examen = contenidoBinario.resultado_examenFile || null;
            convocatoria.contenido_resultado_entrevista = contenidoBinario.resultado_entrevistaFile || null;
            convocatoria.contenido_puntaje_final = contenidoBinario.puntaje_finalFile || null;
        }

        await convocatoria.save();

        // Elimina los archivos temporales creados por Multer
        const archivosTemporales = ['anexosFile', 'comunicacion1File', 'comunicacion2File', 'comunicacion3File', 'comunicacionesFile', 'avisoFile', 'resultado_evaluacion_curricularFile', 'resultado_examenFile', 'resultado_entrevistaFile', 'puntaje_finalFile'];

        archivosTemporales.forEach((campo) => {
            if (req.files[campo] && req.files[campo].length > 0) {
                fs.unlinkSync(req.files[campo][0].path);
            }
        });

        res.send('Convocatoria actualizada');
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
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

