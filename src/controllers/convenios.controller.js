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
    const {description, linkDocument, period, number } = req.body;
    try {
        const nuevoConvenio = await Convenio.create({
            description,
            linkDocument,
            period,
            number
        })
        res.json(nuevoConvenio);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarConvenio = async (req, res) =>{
    const { id } = req.params;
    const { description, linkDocument, period, number } = req.body;

    try{
    const convenio = await Convenio.findByPk(id);
    
    convenio.description = description;
    convenio.linkDocument = linkDocument;
    convenio.period = period;
    convenio.number = number;
    await convenio.save(); 
    res.send('Actualizando');
    }
    catch(error){
         return res.status(500).json({ message: error.message })
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
        return res.status(500).json({ message: error.message})
    }
}