import express from 'express';
import categoriasRoutes from './routes/categoria.routes.js'
import areasRoutes from './routes/area.routes.js'
import tiposDocumentoRoutes from './routes/tipodocumento.routes.js'
import noticiasRoutes from './routes/noticia.routes.js'
import conveniosRoutes from './routes/convenio.routes.js'
import convocatoriasRoutes from './routes/convocatoria.routes.js'
import resolucionesRoutes from './routes/resolucion.routes.js'
import imagenesNoticias from './routes/noticiaimagen.routes.js'
import uitsRoutes from './routes/uit.routes.js'
import serviciosRoutes from './routes/servicio.routes.js'
import directivasRoutes from './routes/directiva.routes.js'
import normasRoutes from './routes/normainstitucional.routes.js'
import rendicionRoutes from './routes/rendicion.routes.js'
import videosRoutes from './routes/video.routes.js'

const app = express();
//middlewares
app.use(express.json());

app.use(categoriasRoutes);
app.use(areasRoutes);
app.use(tiposDocumentoRoutes);
app.use(noticiasRoutes);
app.use(resolucionesRoutes);
app.use(conveniosRoutes);
app.use(imagenesNoticias);
app.use(convocatoriasRoutes);
app.use(uitsRoutes);
app.use(serviciosRoutes);
app.use(directivasRoutes);
app.use(normasRoutes);
app.use(rendicionRoutes);
app.use(videosRoutes);

export default app