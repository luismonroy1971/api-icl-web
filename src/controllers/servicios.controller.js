import { Sequelize } from 'sequelize';
import {Servicio} from '../models/Servicio.js';

const convertirDecimalANumero = (decimal) => {
  // Convierte Sequelize.Decimal a un número

  return decimal ? Number(decimal.toString()) : 0.00;
};

export const leerServicios = async (req, res) => {
  try {
      const servicios = await Servicio.findAll({
          where: {
              activo: '1',
              autorizado: '1'
          },
      });

      // Formatear monto_soles en la respuesta
      const serviciosFormateados = servicios.map(servicio => {
          const servicioJSON = servicio.toJSON();
          servicioJSON.monto_soles = convertirDecimalANumero(servicioJSON.monto_soles);

          return {
              ...servicioJSON,
              monto_soles: servicioJSON.monto_soles !== null ? servicioJSON.monto_soles.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
          };
      });

      res.json(serviciosFormateados);
  } catch (error) {
      return res.status(500).json({ mensaje: error.message });
  }
};

export const buscarServicios = async (req, res) => {
    const { tipo_servicio, periodo_servicio, numero_servicio, sub_nivel_servicio, denominacion_servicio, autorizado, activo } = req.query;
  
    try {
      const whereClause = {};
  
      if (tipo_servicio) {
        whereClause.tipo_servicio = tipo_servicio;
      }

      if (autorizado) {
        whereClause.autorizado = autorizado;
      }
  
      if (periodo_servicio) {
        whereClause.periodo_servicio = periodo_servicio;
      }
  
      if (numero_servicio) {
        whereClause.numero_servicio = numero_servicio;
      }
  
      if (sub_nivel_servicio) {
        whereClause.sub_nivel_servicio = sub_nivel_servicio;
      }
  
      if (denominacion_servicio) {
        whereClause.denominacion_servicio = {
          [Sequelize.Op.like]: `%${denominacion_servicio}%`
        };
      }

      if (activo) {
        whereClause.activo = activo;
      }
  
        
        const servicios = await Servicio.findAll({
          where: Object.keys(whereClause).length === 0 ? {} : whereClause,
          order: [
              ['tipo_servicio', 'ASC'],
              ['numero_servicio', 'ASC'],
              ['sub_nivel_servicio', 'ASC']
          ]
      });
      const serviciosFormateados = servicios.map(servicio => {
        const servicioJSON = servicio.toJSON();
        servicioJSON.monto_soles = convertirDecimalANumero(servicioJSON.monto_soles);
        return {
          ...servicioJSON,
          monto_soles: servicioJSON.monto_soles !== null ? servicioJSON.monto_soles.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'
        };
      });
            res.json(serviciosFormateados);
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

export const leerServicio = async (req, res) =>{
    const { id } = req.params;
    try {
        const servicio = await Servicio.findOne({
            where:{
                id
            }
        })
        res.json(servicio);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearServicio = async (req, res) =>{
    const {tipo_servicio, periodo_servicio, numero_servicio, sub_nivel_servicio, denominacion_servicio, por_uit, monto_soles, monto_uit, creado_por, creado_fecha } = req.body;
    try {
        const nuevoServicio = await Servicio.create({
            tipo_servicio, 
            periodo_servicio, 
            numero_servicio, 
            sub_nivel_servicio, 
            denominacion_servicio, 
            por_uit, 
            monto_soles, 
            monto_uit,
            creado_por, 
            creado_fecha
        })
        res.json(nuevoServicio);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarServicio = async (req, res) =>{
    const { id } = req.params;
    const { tipo_servicio, periodo_servicio, numero_servicio, sub_nivel_servicio, denominacion_servicio, por_uit, monto_soles, monto_uit, modificado_por, modificado_fecha, activo } = req.body;

    try {
        const servicio = await Servicio.findByPk(id);
        servicio.tipo_servicio = tipo_servicio;
        servicio.periodo_servicio = periodo_servicio;
        servicio.numero_servicio = numero_servicio;
        servicio.sub_nivel_servicio = sub_nivel_servicio;
        servicio.denominacion_servicio = denominacion_servicio;
        servicio.por_uit = por_uit;
        servicio.monto_soles = monto_soles;
        servicio.monto_uit = monto_uit;
        servicio.modificado_por = modificado_por;
        servicio.modificado_fecha = modificado_fecha;
        servicio.autorizado = '0';
        servicio.autorizado_por = null;
        servicio.autorizado_fecha = null;
        servicio.activo = activo;
        await servicio.save(); 
         res.json({ mensaje: 'Servicio actualizado con éxito' });
    }
    catch(error){
        return res.status(500).json({ mensaje: error.message })
    }
}

export const autorizarServicio = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try {
      const servicio = await Servicio.findByPk(id);
      servicio.autorizado = autorizado;
      servicio.autorizado_por = autorizado_por;
      servicio.autorizado_fecha = autorizado_fecha;
      await servicio.save(); 
      res.send('Servicio autorizado / desautorizado');
  }
  catch(error){
      return res.status(500).json({ mensaje: error.message })
  }
}


export const eliminarServicio = async (req, res) =>{

    try {
        const { id } = req.params
        await Servicio.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarServicio = async (req, res) => {
  try {
    const { id } = req.params; 

    const servicio = await Servicio.findByPk(id);

    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrada' });
    }

    servicio.activo = '1'; // Establecer activo en '1'
    await servicio.save();

    res.json({ mensaje: 'Servicio activada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const desactivarServicio = async (req, res) => {
  try {
    const { id } = req.params; 

    const servicio = await Servicio.findByPk(id);

    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrada' });
    }

    servicio.activo = '0'; // Establecer activo en '0'
    await servicio.save();

    res.json({ mensaje: 'Servicio desactivada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const obtenerValorDeServicio = async (req, res) => {
  try {
    const { tipo_servicio, numero_servicio, sub_nivel_servicio } = req.query;

    if (!tipo_servicio || !numero_servicio || !sub_nivel_servicio) {
      if (res && res.status && res.json) {
        // Devuelve una respuesta JSON válida en caso de error
        return res.status(400).json({ error: 'Los parámetros "tipo_servicio", "numero_servicio", "sub_nivel_servicio" son obligatorios' });
      } else {
        // Si 'res' no está definido, devuelve un objeto con un mensaje de error
        console.error('Error: res no es una respuesta HTTP válida.');
        return { error: 'Error en el servidor.' };
      }
    }

    // Define las condiciones iniciales para la búsqueda
    let condiciones;
    condiciones = {
      tipo_servicio,
      numero_servicio,
      sub_nivel_servicio
    };

    const servicios = await Servicio.findAll({
      where: condiciones,
      attributes: ['tipo_servicio', 'numero_servicio', 'sub_nivel_servicio', 'denominacion_servicio', 'monto_soles'],
    });

    let valorServicio = 0;
    let denominacionServicio = '';

    // Itera sobre los servicios para encontrar el valor correcto
    for (const servicio of servicios) {
      valorServicio = parseFloat(servicio.monto_soles);
      denominacionServicio = servicio.denominacion_servicio;
      break;
    }
    
    if (!isNaN(valorServicio)) {
      valorServicio = (valorServicio * 100) / 100; // Formatea a dos decimales
    } else {
      valorServicio = 0;
    }

    if (res && res.status && res.json) {
      // Devuelve una respuesta JSON válida en todos los casos
      return res.status(200).json({ denominacion_servicio: denominacionServicio, valor_servicio: Number(valorServicio.toFixed(2)) });
    } else {
      console.error('Error: res no es una respuesta HTTP válida.');
      // Si 'res' no está definido, devuelve un objeto con un mensaje de error
      return { error: 'Error en el servidor.' };
    }

  } catch (error) {
    console.error(error);
    if (res && res.status && res.json) {
      return res.status(500).json({ error: 'Error en el servidor.' });
    } else {
      return { error: 'Error en el servidor.' };
    }
  }
};


export const acumularValoresDeServicio = async (req, res) => {
  try {
    const { tipo_servicio, numero_servicio, metraje, flag_construccion, periodo_servicio } = req.query;

    if (!tipo_servicio || !numero_servicio || !metraje || !flag_construccion) {
      return res.status(400).json({ error: 'Los parámetros "tipo_servicio", "numero_servicio", "flag_construccion" y "metraje" son obligatorios' });
    }

    let sumaTotal = 0;
    let resultados = [];

    // Itera sobre el rango de sub_nivel_servicio de 1 a 10
    for (let sub_nivel_servicio = 1; sub_nivel_servicio <= 10; sub_nivel_servicio++) {
      const respuestaObtenerValor = await obtenerValorDeServicio({
        query: {
          tipo_servicio,
          numero_servicio, // Usa el valor parseado
          sub_nivel_servicio,
          periodo_servicio,
        },
        // Pasa directamente el objeto req para asegurarte de que todos los parámetros sean pasados correctamente
        req,
      });

      if (respuestaObtenerValor.valor_servicio !== null) {
        sumaTotal += parseFloat(respuestaObtenerValor.valor_servicio);
        resultados.push(respuestaObtenerValor);
      }
    }

    return res.json({ suma_total: sumaTotal, resultados });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el servidor.' });
  }
};


