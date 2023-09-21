import {Convenio} from '../models/Convenio.js';

export const leerConvenios = async (req, res) =>{
    try {
        const convenios = await Convenio.findAll();
        res.json(convenios);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

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

export const crearConvenio = async (req, res) =>{
    const {descripcion_convenio, url_documento_convenio, periodo_convenio, numero_convenio } = req.body;
    try {
        const nuevoConvenio = await Convenio.create({
            descripcion_convenio,
            url_documento_convenio,
            periodo_convenio,
            numero_convenio
        })
        res.json(nuevoConvenio);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarConvenio = async (req, res) =>{
    const { id } = req.params;
    const { descripcion_convenio, url_documento_convenio, periodo_convenio, numero_convenio, autorizado, autorizado_por, activo } = req.body;

    try{
    const convenio = await Convenio.findByPk(id);
    
    convenio.descripcion_convenio = descripcion_convenio;
    convenio.url_documento_convenio = url_documento_convenio;
    convenio.periodo_convenio = periodo_convenio;
    convenio.numero_convenio = numero_convenio;
    convenio.autorizado = autorizado;
    convenio.autorizado_por = autorizado_por;
    convenio.activo = activo;
    await convenio.save(); 
    res.send('Convenio actualizado');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarConvenio = async (req, res) =>{

    try {
        const { id } = req.params
        await Convenio.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}