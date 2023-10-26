import { Sequelize } from 'sequelize';
import {Funcionario} from '../models/Funcionario.js';

export const leerFuncionarios = async (req, res) =>{
    try {
        const funcionarios = await Funcionario.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(funcionarios);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarFuncionarios = async (req, res) => {
    const { name, position, autorizado } = req.query;
  
    try {
      const whereClause = {};
  
      if (autorizado) {
        whereClause.autorizado = autorizado;
      }

      if (name) {
        whereClause.name = name;
      }
  
      if (position) {
        whereClause.position = {
          [Sequelize.Op.like]: `%${position}%`
        };
      }
  
      whereClause.activo = '1';
      
      const funcionarios = await Funcionario.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
      });
  
      res.json(funcionarios);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const leerFuncionario = async (req, res) =>{
    const { id } = req.params;
    try {
        const funcionario = await Funcionario.findOne({
            where:{
                id
            }
        })
        res.json(funcionario);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearFuncionario = async (req, res) =>{
    const {name, position, image, link, creado_por, creado_fecha } = req.body;
    try {
        const nuevoFuncionario = await Funcionario.create({
          name,
          position,
          image,
          link,
          creado_por, 
          creado_fecha
        })
        res.json(nuevoFuncionario);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarFuncionario = async (req, res) =>{
    const { id } = req.params;
    const { name, position, image, link, modificado_por, modificado_fecha, activo } = req.body;

    try{
    const funcionario = await Funcionario.findByPk(id);
    
    funcionario.name = name;
    funcionario.position = position;
    funcionario.image = image;
    funcionario.link = link;
    funcionario.modificado_por = modificado_por;
    funcionario.modificado_fecha = modificado_fecha;
    funcionario.autorizado = '0';
    funcionario.autorizado_por = null;
    funcionario.autorizado_fecha = null;
    funcionario.activo = activo;
    await funcionario.save(); 
    res.send('Funcionario actualizado');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}

export const autorizarFuncionario = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try{
  const funcionario = await Funcionario.findByPk(id);
  funcionario.autorizado = autorizado;
  funcionario.autorizado_por = autorizado_por;
  funcionario.autorizado_fecha = autorizado_fecha;
  await funcionario.save(); 
  res.send('Funcionario autorizado / desautorizado');
  }
  catch(error){
       return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarFuncionario = async (req, res) =>{

    try {
        const { id } = req.params
        await Funcionario.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarFuncionario = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const funcionario = await Funcionario.findByPk(id);
  
      if (!funcionario) {
        return res.status(404).json({ mensaje: 'Funcionario no encontrado' });
      }
  
      funcionario.activo = '1'; // Establecer activo en '1'
      await funcionario.save();
  
      res.json({ mensaje: 'Funcionario activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarFuncionario = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const funcionario = await Funcionario.findByPk(id);
  
      if (!funcionario) {
        return res.status(404).json({ mensaje: 'Funcionario no encontrado' });
      }
  
      funcionario.activo = '0'; // Establecer activo en '0'
      await funcionario.save();
  
      res.json({ mensaje: 'Funcionario desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
