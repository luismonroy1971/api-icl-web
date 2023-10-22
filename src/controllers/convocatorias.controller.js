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
    const { tipo_convocatoria, numero_convocatoria, periodo_convocatoria, estado_convocatoria, descripcion_convocatoria, id_area, autorizado } = req.query;
  
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

      whereClause.activo = '1';
  
      const convocatorias = await Convocatoria.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause,
        order: [
          ['periodo_convocatoria', 'ASC'],
          ['numero_convocatoria', 'ASC']
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
    } = req.files; // Acceder a los archivos cargados

    try {
        let url_anexos = null;
        let url_comunicacion1 = null;
        let url_comunicacion2 = null;
        let url_comunicacion3 = null;
        let url_comunicaciones = null;
        let url_aviso = null;
        let url_resultado_evaluacion_curricular = null;
        let url_resultado_examen = null;
        let url_resultado_entrevista = null;
        let url_puntaje_final = null;

        let contenido_anexos = null;
        let contenido_comunicacion1 = null;
        let contenido_comunicacion2 = null;
        let contenido_comunicacion3 = null;
        let contenido_comunicaciones = null;
        let contenido_aviso = null;
        let contenido_resultado_evaluacion_curricular = null;
        let contenido_resultado_examen = null;
        let contenido_resultado_entrevista = null;
        let contenido_puntaje_final = null;

        if (flag_adjunto === 'URL') {
            // Asignar las URLs desde los archivos
            url_anexos = anexosUrl ? `\\convenios\\${anexosUrl[0].filename}` : null;
            url_comunicacion1 = comunicacion1Url ? `\\convenios\\${comunicacion1Url[0].filename}` : null;
            url_comunicacion2 = comunicacion2Url ? `\\convenios\\${comunicacion2Url[0].filename}` : null;
            url_comunicacion3 = comunicacion3Url ? `\\convenios\\${comunicacion3Url[0].filename}` : null;
            url_comunicaciones = comunicacionesUrl ? `\\convenios\\${comunicacionesUrl[0].filename}` : null;
            url_aviso = avisoUrl ? `\\convenios\\${avisoUrl[0].filename}` : null;
            url_resultado_evaluacion_curricular = resultado_evaluacion_curricularUrl ? `\\convenios\\${resultado_evaluacion_curricularUrl[0].filename}` : null;
            url_resultado_examen = resultado_examenUrl ? `\\convenios\\${resultado_examenUrl[0].filename}` : null;
            url_resultado_entrevista = resultado_entrevistaUrl ? `\\convenios\\${resultado_entrevistaUrl[0].filename}` : null;
            url_puntaje_final = puntaje_finalUrl ? `\\convenios\\${puntaje_finalUrl[0].filename}` : null;
        } else if (flag_adjunto === 'BIN') {
            // Asignar el contenido binario desde los archivos
            contenido_anexos = anexosFile ? fs.readFileSync(anexosFile[0].path) : null;
            contenido_comunicacion1 = comunicacion1File ? fs.readFileSync(comunicacion1File[0].path) : null;
            contenido_comunicacion2 = comunicacion2File ? fs.readFileSync(comunicacion2File[0].path) : null;
            contenido_comunicacion3 = comunicacion3File ? fs.readFileSync(comunicacion3File[0].path) : null;
            contenido_comunicaciones = comunicacionesFile ? fs.readFileSync(comunicacionesFile[0].path) : null;
            contenido_aviso = avisoFile ? fs.readFileSync(avisoFile[0].path) : null;
            contenido_resultado_evaluacion_curricular = resultado_evaluacion_curricularFile ? fs.readFileSync(resultado_evaluacion_curricularFile[0].path) : null;
            contenido_resultado_examen = resultado_examenFile ? fs.readFileSync(resultado_examenFile[0].path) : null;
            contenido_resultado_entrevista = resultado_entrevistaFile ? fs.readFileSync(resultado_entrevistaFile[0].path) : null;
            contenido_puntaje_final = puntaje_finalFile ? fs.readFileSync(puntaje_finalFile[0].path) : null;
        }

        const nuevaConvocatoria = await Convocatoria.create({
            descripcion_convocatoria,
            id_area,
            tipo_convocatoria,
            numero_convocatoria,
            periodo_convocatoria,
            estado_convocatoria,
            creado_por,
            creado_fecha,
            url_anexos,
            url_comunicacion1,
            url_comunicacion2,
            url_comunicacion3,
            url_comunicaciones,
            url_aviso,
            url_resultado_evaluacion_curricular,
            url_resultado_examen,
            url_resultado_entrevista,
            url_puntaje_final,
            contenido_anexos,
            contenido_comunicacion1,
            contenido_comunicacion2,
            contenido_comunicacion3,
            contenido_comunicaciones,
            contenido_aviso,
            contenido_resultado_evaluacion_curricular,
            contenido_resultado_examen,
            contenido_resultado_entrevista,
            contenido_puntaje_final
        });

        // Elimina los archivos temporales creados por Multer
        if (flag_adjunto === 'URL') {
            anexosFile && fs.unlinkSync(anexosFile[0].path);
            comunicacion1File && fs.unlinkSync(comunicacion1File[0].path);
            comunicacion2File && fs.unlinkSync(comunicacion2File[0].path);
            comunicacion3File && fs.unlinkSync(comunicacion3File[0].path);
            comunicacionesFile && fs.unlinkSync(comunicacionesFile[0].path);
            avisoFile && fs.unlinkSync(avisoFile[0].path);
            resultado_evaluacion_curricularFile && fs.unlinkSync(resultado_evaluacion_curricularFile[0].path);
            resultado_examenFile && fs.unlinkSync(resultado_examenFile[0].path);
            resultado_entrevistaFile && fs.unlinkSync(resultado_entrevistaFile[0].path);
            puntaje_finalFile && fs.unlinkSync(puntaje_finalFile[0].path);
        }

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
    } = req.files; // Acceder a los archivos cargados

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
        convocatoria.activo = activo;

        if (flag_adjunto === 'URL') {
            // Actualiza las URLs desde los archivos
            convocatoria.url_anexos = anexosUrl ? `\\convenios\\${anexosUrl[0].filename}` : null;
            convocatoria.url_comunicacion1 = comunicacion1Url ? `\\convenios\\${comunicacion1Url[0].filename}` : null;
            convocatoria.url_comunicacion2 = comunicacion2Url ? `\\convenios\\${comunicacion2Url[0].filename}` : null;
            convocatoria.url_comunicacion3 = comunicacion3Url ? `\\convenios\\${comunicacion3Url[0].filename}` : null;
            convocatoria.url_comunicaciones = comunicacionesUrl ? `\\convenios\\${comunicacionesUrl[0].filename}` : null;
            convocatoria.url_aviso = avisoUrl ? `\\convenios\\${avisoUrl[0].filename}` : null;
            convocatoria.url_resultado_evaluacion_curricular = resultado_evaluacion_curricularUrl ? `\\convenios\\${resultado_evaluacion_curricularUrl[0].filename}` : null;
            convocatoria.url_resultado_examen = resultado_examenUrl ? `\\convenios\\${resultado_examenUrl[0].filename}` : null;
            convocatoria.url_resultado_entrevista = resultado_entrevistaUrl ? `\\convenios\\${resultado_entrevistaUrl[0].filename}` : null;
            convocatoria.url_puntaje_final = puntaje_finalUrl ? `\\convenios\\${puntaje_finalUrl[0].filename}` : null;
        } else if (flag_adjunto === 'BIN') {
            // Actualiza el contenido binario desde los archivos
            convocatoria.contenido_anexos = anexosFile ? fs.readFileSync(anexosFile[0].path) : null;
            convocatoria.contenido_comunicacion1 = comunicacion1File ? fs.readFileSync(comunicacion1File[0].path) : null;
            convocatoria.contenido_comunicacion2 = comunicacion2File ? fs.readFileSync(comunicacion2File[0].path) : null;
            convocatoria.contenido_comunicacion3 = comunicacion3File ? fs.readFileSync(comunicacion3File[0].path) : null;
            convocatoria.contenido_comunicaciones = comunicacionesFile ? fs.readFileSync(comunicacionesFile[0].path) : null;
            convocatoria.contenido_aviso = avisoFile ? fs.readFileSync(avisoFile[0].path) : null;
            convocatoria.contenido_resultado_evaluacion_curricular = resultado_evaluacion_curricularFile ? fs.readFileSync(resultado_evaluacion_curricularFile[0].path) : null;
            convocatoria.contenido_resultado_examen = resultado_examenFile ? fs.readFileSync(resultado_examenFile[0].path) : null;
            convocatoria.contenido_resultado_entrevista = resultado_entrevistaFile ? fs.readFileSync(resultado_entrevistaFile[0].path) : null;
            convocatoria.contenido_puntaje_final = puntaje_finalFile ? fs.readFileSync(puntaje_finalFile[0].path) : null;
        }

        await convocatoria.save();

        // Elimina los archivos temporales creados por Multer
        if (flag_adjunto === 'URL') {
            anexosFile && fs.unlinkSync(anexosFile[0].path);
            comunicacion1File && fs.unlinkSync(comunicacion1File[0].path);
            comunicacion2File && fs.unlinkSync(comunicacion2File[0].path);
            comunicacion3File && fs.unlinkSync(comunicacion3File[0].path);
            comunicacionesFile && fs.unlinkSync(comunicacionesFile[0].path);
            avisoFile && fs.unlinkSync(avisoFile[0].path);
            resultado_evaluacion_curricularFile && fs.unlinkSync(resultado_evaluacion_curricularFile[0].path);
            resultado_examenFile && fs.unlinkSync(resultado_examenFile[0].path);
            resultado_entrevistaFile && fs.unlinkSync(resultado_entrevistaFile[0].path);
            puntaje_finalFile && fs.unlinkSync(puntaje_finalFile[0].path);
        }

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

