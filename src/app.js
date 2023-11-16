import express from 'express';
import cors from 'cors';
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
import usuariosRoutes from './routes/usuario.routes.js'
import departamentosRoutes from './routes/departamento.routes.js'
import provinciasRoutes from './routes/provincia.routes.js'
import distritosRoutes from './routes/distrito.routes.js'
import memoriasRoutes from './routes/memoria.routes.js'
import proyectosRoutes from './routes/proyecto.routes.js'
import cursosRoutes from './routes/curso.routes.js'
import funcionariosRoutes from './routes/funcionario.routes.js'
import menusRoutes from './routes/menu.routes.js'
import opcionesRoutes from './routes/opcionesusuario.routes.js'
import campostablaRoutes from './routes/campostablas.routes.js'
import popupRoutes from './routes/popup.routes.js'
import avisoRoutes from './routes/aviso.routes.js'
import anexoRoutes from './routes/anexo.routes.js'
import curriculoRoutes from './routes/curriculo.routes.js'
import comunicacion1Routes from './routes/comunicacion1.routes.js'
import entrevistaRoutes from './routes/entrevista.routes.js'
import resultadoRoutes from './routes/final.routes.js'
import examenRoutes from './routes/examen.routes.js'

const app = express();
//middlewares
app.use(cors());
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
app.use(usuariosRoutes);
app.use(provinciasRoutes);
app.use(departamentosRoutes);
app.use(distritosRoutes);
app.use(memoriasRoutes);
app.use(proyectosRoutes);
app.use(funcionariosRoutes);
app.use(cursosRoutes);
app.use(menusRoutes);
app.use(opcionesRoutes);
app.use(campostablaRoutes);
app.use(popupRoutes);
app.use(avisoRoutes);
app.use(anexoRoutes);
app.use(curriculoRoutes);
app.use(comunicacion1Routes);
app.use(entrevistaRoutes);
app.use(resultadoRoutes);
app.use(examenRoutes);

export default app