import {Convocatoria} from '../models/Convocatoria.js';

export const leerConvocatorias = async (req, res) =>{
    try {
        const convocatorias = await Convocatoria.findAll();
        res.json(convocatorias);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

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

export const crearConvocatoria = async (req, res) =>{
    const {description, type, number, period, linkcommunication,  linknotification, linkcurricularevaluationresult, linkvirtualexamresult, linkvirtualinterviewresult, linkfinalscore } = req.body;
    try {
        const nuevaConvocatoria = await Convocatoria.create({
            description,
            type,
            number,
            period,
            linkcommunication,
            linknotification,
            linkcurricularevaluationresult,
            linkvirtualexamresult,
            linkvirtualinterviewresult,
            linkfinalscore
        })
        res.json(nuevaConvocatoria);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarConvocatoria = async (req, res) =>{
    const { id } = req.params;
    const { description, type, number, period, linkcommunication,  linknotification, linkcurricularevaluationresult, linkvirtualexamresult, linkvirtualinterviewresult, linkfinalscore } = req.body;

    try {

        const convocatoria = await Convocatoria.findByPk(id);
        convocatoria.description = description;
        convocatoria.type = type;
        convocatoria.number = number;
        convocatoria.period = period;
        convocatoria.linkcommunication = linkcommunication;
        convocatoria.linknotification = linknotification;
        convocatoria.linkcurricularevaluationresult = linkcurricularevaluationresult;
        convocatoria.linkvirtualexamresult = linkvirtualexamresult;
        convocatoria.linkvirtualinterviewresult = linkvirtualinterviewresult;
        convocatoria.linkfinalscore = linkfinalscore;

        await convocatoria.save(); 
        res.send('Actualizando');
    }
    catch(error){
        return res.status(500).json({ message: error.message })
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