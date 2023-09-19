import express from 'express';
import categoriasRoutes from './routes/categoria.routes.js'
import areasRoutes from './routes/area.routes.js'
import tiposDocumentoRoutes from './routes/tipodocumento.routes.js'
import noticiasRoutes from './routes/noticia.routes.js'
import conveniosRoutes from './routes/convenio.routes.js'
import convocatoriasRoutes from './routes/convocatoria.routes.js'
import resolucionesRoutes from './routes/resolucion.routes.js'
// import serviciosRoutes from './routes/servicio.routes.js'


const app = express();
//middlewares
app.use(express.json());

app.use(categoriasRoutes);
app.use(areasRoutes);
app.use(tiposDocumentoRoutes);
app.use(noticiasRoutes);
app.use(resolucionesRoutes);
app.use(conveniosRoutes);
// app.use(serviciosRoutes);
app.use(convocatoriasRoutes);

export default app