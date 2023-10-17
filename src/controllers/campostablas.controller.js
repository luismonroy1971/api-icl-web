import { CamposTablas } from '../models/CamposTablas.js';

export const obtenerCamposTablasPorIdMenu = async (req, res) => {
  try {
    const { id_menu } = req.params; // Obtén el id_menu de los parámetros

    if (!id_menu) {
      return res.status(400).json({ message: "El parámetro id es obligatorio." });
    }

    // Utiliza la función findAll de CamposTablas para obtener los registros
    const camposTablas = await CamposTablas.findAll({
      where: { id_menu }, // Filtra por el id_menu proporcionado
    });

    if (!camposTablas || camposTablas.length === 0) {
      return res.status(404).json({ message: "No se encontraron registros de CamposTablas para el id_menu proporcionado." });
    }

    res.json(camposTablas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const leerCamposTablas = async (req, res) =>{
    try {
        const campostablas = await CamposTablas.findAll({
          });
          res.json(campostablas);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerCamposTabla = async (req, res) =>{
    const { id } = req.params;
    try {
        const campostabla = await CamposTablas.findAll({
            where:{
                id
            }
        })
        res.json(campostabla);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearCamposTabla = async (req, res) =>{
    const {id_menu, tabla, nombre_campo, tipo, backend, ancho, valores } = req.body;
    console.log(descripcion_campostabla, abreviacion_campostabla)
    try {
        const nuevaCamposTabla = await CamposTablas.create({
            id_menu, tabla, nombre_campo, tipo, backend, ancho, valores
        })
        res.json(nuevaCamposTabla);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarCamposTabla = async (req, res) =>{
    const { id } = req.params;
    const { id_menu, tabla, nombre_campo, tipo, backend, ancho, valores } = req.body;

    try{
    const campostabla = await CamposTablas.findByPk(id);
    campostabla.id_menu = id_menu;
    campostabla.tabla = tabla;
    campostabla.nombre_campo = nombre_campo;
    campostabla.tipo = tipo;
    campostabla.backend = backend;
    campostabla.ancho = ancho;
    campostabla.valores = valores;
    await campostabla.save(); 
    res.send('CamposTabla actualizada');
    }
        catch(error){
        return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarCamposTabla = async (req, res) =>{

    try {
        const { id } = req.params
        await CamposTablas.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}