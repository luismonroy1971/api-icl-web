import {TipoDocumento} from '../models/TipoDocumento.js';

export const leerTipoDocumentos = async (req, res) =>{
    try {
        const tipodocumento = await TipoDocumento.findAll();
        res.json(tipodocumento);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
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

export const crearTipoDocumento = async (req, res) =>{
    const { descripcion_tipo_documento, codigo_tramite_documentario } = req.body;
    try {
        const nuevoTipoDocumento = await TipoDocumento.create({
            descripcion_tipo_documento,
            codigo_tramite_documentario
        })
        res.json(nuevoTipoDocumento);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarTipoDocumento = async (req, res) =>{
    const { id } = req.params;
    const { descripcion_tipo_documento, codigo_tramite_documentario, activo } = req.body;
    try {
    const tipodocumento = await TipoDocumento.findByPk(id);
    tipodocumento.descripcion_tipo_documento = descripcion_tipo_documento;
    tipodocumento.codigo_tramite_documentario = codigo_tramite_documentario;
    tipodocumento.activo = activo;
    await tipodocumento.save(); 
    res.send('Tipo de documento actualizado');
    }
    catch(error){
       return res.status(500).json({ mensaje: error.message })
    }
}

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