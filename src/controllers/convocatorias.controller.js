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
    const { descripcion_convocatoria, tipo_convocatoria, numero_convocatoria, periodo_convocatoria, url_comunicacion, url_aviso, url_resultado_evaluacion_curricular, url_resultado_examen_virtual, url_resultado_entrevista_virtual, url_puntaje_final } = req.body;
    try {
        const nuevaConvocatoria = await Convocatoria.create({
            descripcion_convocatoria, 
            tipo_convocatoria, 
            numero_convocatoria, 
            periodo_convocatoria, 
            url_comunicacion, 
            url_aviso, 
            url_resultado_evaluacion_curricular, 
            url_resultado_examen_virtual, 
            url_resultado_entrevista_virtual, 
            url_puntaje_final
        })
        res.json(nuevaConvocatoria);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarConvocatoria = async (req, res) =>{
    const { id } = req.params;
    const { descripcion_convocatoria, tipo_convocatoria, numero_convocatoria, periodo_convocatoria, url_comunicacion, url_aviso, url_resultado_evaluacion_curricular, url_resultado_examen_virtual, url_resultado_entrevista_virtual, url_puntaje_final, autorizado, autorizadoPor, activo } = req.body;

    try {

        const convocatoria = await Convocatoria.findByPk(id);
        convocatoria.descripcion_convocatoria = descripcion_convocatoria;
        convocatoria.tipo_convocatoria = tipo_convocatoria;
        convocatoria.numero_convocatoria = numero_convocatoria;
        convocatoria.periodo_convocatoria = periodo_convocatoria;
        convocatoria.url_comunicacion = url_comunicacion;
        convocatoria.url_aviso = url_aviso;
        convocatoria.url_resultado_evaluacion_curricular = url_resultado_evaluacion_curricular;
        convocatoria.url_resultado_examen_virtual = url_resultado_examen_virtual;
        convocatoria.url_resultado_entrevista_virtual = url_resultado_entrevista_virtual;
        convocatoria.url_puntaje_final = url_puntaje_final;
        convocatoria.autorizado = autorizado;
        convocatoria.autorizadoPor = autorizadoPor;
        convocatoria.activo = activo;

        await convocatoria.save(); 
        
        res.send('Convocatoria actualizada');
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