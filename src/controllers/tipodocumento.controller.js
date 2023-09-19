import {TipoDocumento} from '../models/TipoDocumento.js';

export const leerTipoDocumentos = async (req, res) =>{
    try {
        const tipodocumento = await TipoDocumento.findAll();
        res.json(tipodocumento);
    } catch (error) {
        return res.status(500).json({ message: error.message })
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
        return res.status(500).json({ message: error.message })
    }

}

export const crearTipoDocumento = async (req, res) =>{
    const {description } = req.body;
    try {
        const nuevoTipoDocumento = await TipoDocumento.create({
            description
        })
        res.json(nuevoTipoDocumento);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarTipoDocumento = async (req, res) =>{
    const { id } = req.params;
    const { description } = req.body;
    try {
    const tipodocumento = await TipoDocumento.findByPk(id);
    console.log(tipodocumento);
    tipodocumento.description = description;
    await tipodocumento.save(); 
    res.send('Actualizando');
    }
    catch(error){
       return res.status(500).json({ message: error.message })
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
        return res.status(500).json({ message: error.message})
    }
}