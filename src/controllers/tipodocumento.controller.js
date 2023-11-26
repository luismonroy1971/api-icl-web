import {TipoDocumento} from '../models/TipoDocumento.js';
import { Op } from 'sequelize';

export const leerTipoDocumentos = async (req, res) => {
  try {
    const { activo } = req.query;
    const whereClause = activo ? { activo } : {};

    const tipodocumento = await TipoDocumento.findAll({
      where: whereClause,
    });

    res.json(tipodocumento);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
}

export const leerTipoDocumento = async (req, res) =>{
    const { id } = req.params;
    try {
        const tipodocumento = await TipoDocumento.findOne({
            where:{
                id
            }
        })
        res.json(tipodocumento);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}


export const crearTipoDocumento = async (req, res) => {
  const { descripcion_tipo_documento, codigo_tramite_documentario } = req.body;

  try {
    if (codigo_tramite_documentario !== '') {
      // Verificar existencia solo si se proporciona el código_tramite_documentario
      const codigoTramiteExistente = await TipoDocumento.findOne({
        where: {
          codigo_tramite_documentario: codigo_tramite_documentario,
        },
      });

      // Si ya existe, enviar un mensaje de error
      if (codigoTramiteExistente) {
        return res.status(400).json({ mensaje: 'El código de trámite documentario ya está registrado.' });
      }
    }

    // Crear el nuevo tipo de documento
    const nuevoTipoDocumento = await TipoDocumento.create({
      descripcion_tipo_documento,
      codigo_tramite_documentario,
    });

    res.json({ mensaje: 'Creación de tipo de documento satisfactoria', nuevoTipoDocumento });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};



export const actualizarTipoDocumento = async (req, res) => {
  const { id } = req.params;
  const { descripcion_tipo_documento, codigo_tramite_documentario, activo } = req.body;

  try {
    // Verificar si ya existe otro tipo de documento con el mismo código de trámite documentario (si tiene información)
    if (codigo_tramite_documentario !== '') {
      const codigoTramiteExistente = await TipoDocumento.findOne({
        where: {
          codigo_tramite_documentario: codigo_tramite_documentario,
          id: { [Op.not]: id }, // Excluir el tipo de documento actual en la búsqueda
        },
      });

      // Si ya existe, enviar un mensaje de error
      if (codigoTramiteExistente) {
        return res.status(400).json({ mensaje: 'Otro tipo de documento ya tiene este código de trámite documentario.' });
      }
    }

    // Si no hay problemas, actualizar el tipo de documento
    const tipoDocumento = await TipoDocumento.findByPk(id);
    tipoDocumento.descripcion_tipo_documento = descripcion_tipo_documento;
    tipoDocumento.codigo_tramite_documentario = codigo_tramite_documentario;
    tipoDocumento.activo = activo;
    await tipoDocumento.save();

    res.json({ mensaje: 'Tipo de documento actualizado con éxito' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const eliminarTipoDocumento = async (req, res) =>{

    try {
        const { id } = req.params
        await TipoDocumento.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarTipoDocumento = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const tipodocumento = await TipoDocumento.findByPk(id);
  
      if (!tipodocumento) {
        return res.status(404).json({ mensaje: 'TipoDocumento no encontrada' });
      }
  
      tipodocumento.activo = '1'; // Establecer activo en '1'
      await tipodocumento.save();
  
      res.json({ mensaje: 'TipoDocumento activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarTipoDocumento = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const tipodocumento = await TipoDocumento.findByPk(id);
  
      if (!tipodocumento) {
        return res.status(404).json({ mensaje: 'TipoDocumento no encontrada' });
      }
  
      tipodocumento.activo = '0'; // Establecer activo en '0'
      await tipodocumento.save();
  
      res.json({ mensaje: 'TipoDocumento desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
