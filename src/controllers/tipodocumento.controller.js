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
    // Validación de la descripción del tipo de documento
    if (!/^[a-zA-Z\s]+$/.test(descripcion_tipo_documento) || descripcion_tipo_documento.length <= 5) {
      return res.status(400).json({ mensaje: 'La descripción del tipo de documento debe contener solo letras y tener más de 5 caracteres.' });
    }

    // Verificar si la descripción del tipo de documento ya existe
    const descripcionExistente = await TipoDocumento.findOne({
      where: { descripcion_tipo_documento },
    });

    if (descripcionExistente) {
      return res.status(400).json({ mensaje: 'La descripción del tipo de documento ya está registrada.' });
    }

    // Validación del código de trámite documentario
    if (codigo_tramite_documentario && (!/^[a-zA-Z0-9]+$/.test(codigo_tramite_documentario) || codigo_tramite_documentario.length <= 4)) {
      return res.status(400).json({ mensaje: 'El código de trámite documentario debe ser alfanumérico y tener más de 4 caracteres.' });
    }

    // Verificar existencia del código de trámite documentario, si se proporciona
    if (codigo_tramite_documentario) {
      const codigoTramiteExistente = await TipoDocumento.findOne({
        where: { codigo_tramite_documentario },
      });

      if (codigoTramiteExistente) {
        return res.status(400).json({ mensaje: 'El código de trámite documentario ya está registrado.' });
      }
    }

    // Crear el nuevo tipo de documento
    const nuevoTipoDocumento = await TipoDocumento.create({
      descripcion_tipo_documento,
      codigo_tramite_documentario,
    });

    return res.status(201).json({ mensaje: 'Tipo de documento creado correctamente', nuevoTipoDocumento });
    
  } catch (error) {
    // Mensaje de error específico basado en el tipo de error
    const errorMessage = error.name === 'SequelizeValidationError' ? 'Error de validación de datos.' : error.message;
    return res.status(500).json({ mensaje: errorMessage });
  }
};



export const actualizarTipoDocumento = async (req, res) => {
  const { id } = req.params;
  const { descripcion_tipo_documento, codigo_tramite_documentario, activo } = req.body;

  try {
    // Validar descripcion_tipo_documento si está presente
    if (descripcion_tipo_documento !== undefined && descripcion_tipo_documento !== '') {
      if (!/^[a-zA-Z\s]+$/.test(descripcion_tipo_documento) || descripcion_tipo_documento.length <= 5) {
        return res.status(400).json({ mensaje: 'La descripción del tipo de documento debe contener solo letras y tener más de 5 caracteres.' });
      }
    }

    // Validar codigo_tramite_documentario solo si se proporciona y no está vacío
    if (codigo_tramite_documentario !== undefined && codigo_tramite_documentario !== '') {
      if (codigo_tramite_documentario.length <= 4) {
        return res.status(400).json({ mensaje: 'El código de trámite documentario debe tener más de 4 caracteres.' });
      }

      // Verificar si ya existe otro tipo de documento con el mismo código de trámite documentario
      const codigoTramiteExistente = await TipoDocumento.findOne({
        where: {
          codigo_tramite_documentario: codigo_tramite_documentario,
          id: { [Op.not]: id }, // Excluir el tipo de documento actual en la búsqueda
        },
      });

      if (codigoTramiteExistente) {
        return res.status(400).json({ mensaje: 'Otro tipo de documento ya tiene este código de trámite documentario.' });
      }
    }

    // Actualizar el tipo de documento
    const tipoDocumento = await TipoDocumento.findByPk(id);
    if (descripcion_tipo_documento !== undefined) {
      tipoDocumento.descripcion_tipo_documento = descripcion_tipo_documento;
    }
    if (codigo_tramite_documentario !== undefined) {
      tipoDocumento.codigo_tramite_documentario = codigo_tramite_documentario;
    }
    tipoDocumento.activo = activo;
    await tipoDocumento.save();

    return res.status(200).json({ mensaje: 'Tipo de documento actualizado correctamente', tipoDocumento });

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
