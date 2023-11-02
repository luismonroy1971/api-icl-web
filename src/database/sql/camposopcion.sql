insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (2,'area','/areas','descripcion_area','Descripción de área','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (2,'area','/areas','abreviacion_area','Abreviación de área','char','',2,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (3,'categoría','/categorias','descripcion_categoria','Descripción de categoría','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (4,'popup','/popups','descripcion_popup','Descripción del popup','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (4,'popup','/popups','flag_adjunto','Tipo de adjunto','array','',3,'[URL,BIN]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (4,'popup','/popups','url_popup','Link de la imagen','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (4,'popup','/popups','contenido_popup','Imagen del popup','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (4,'popup','/popups','fecha_inicial','Fecha inicial','date','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (4,'popup','/popups','fecha_final','Fecha final','date','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (11,'convenio','/convenios','descripcion_convenio','Descripción de convenio','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (11,'convenio','/convenios','fecha_convenio','Fecha de Convenio','date','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (11,'convenio','/convenios','flag_adjunto','Tipo de adjunto','array','',3,'[URL,BIN]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (11,'convenio','/convenios','url_documento_convenio','Link del convenio','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (11,'convenio','/convenios','contenido_documento_convenio','Documento del convenio','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (11,'convenio','/convenios','id_departamento','Departamento','endpoint','/departamentos',4,'id');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (11,'convenio','/convenios','id_provincia','Provincia','endpoint','/provincias',4,'id');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (11,'convenio','/convenios','id_distrito','Distrito','endpoint','/distritos',4,'id');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','descripcion_convocatoria','Descripción de Convocatoria','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','tipo_convocatoria','Tipo de convocatoria','array','',3,'[CAS,PPP]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','numero_convocatoria','Número de convocatoria','number','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','periodo_convocatoria','Periodo de convocatoria','number','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','flag_adjunto','Tipo de adjunto','array','',3,'[URL,BIN]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','url_anexos','Link de los anexos','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','url_comunicacion1','Link de la comunicación 1','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','url_comunicacion2','Link de la comunicación 2','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','url_comunicacion3','Link de la comunicación 3','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','url_comunicaciones','Link de la comunicaciones','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','url_aviso','Link de aviso','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','url_resultado_evaluacion_curricular','Link resultado evaluación curricular','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','url_resultado_examen','Link resultado examen','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','url_resultado_entrevista','Link resultado entrevista','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','url_puntaje_final','Link puntaje final','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','contenido_anexos','Documento de anexos','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','contenido_comunicacion1','Documento comunicación 1','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','contenido_comunicacion2','Documento comunicación 2','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','contenido_comunicacion3','Documento comunicación 3','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','contenido_comunicaciones','Documento comunicaciones','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','contenido_aviso','Documento Aviso','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','contenido_resultado_evaluacion_curricular','Documento resultado evaluación curricular','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','contenido_resultado_examen','Documento resultado examen','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','contenido_resultado_entrevista','Documento resultado entrevista','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','contenido_puntaje_final','Contenido puntaje final','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','id_area','Area','endpoint','/areas',2,'id');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (12,'convocatoria','/convocatorias','estado_convocatoria','Estado convocatoria','array','',15,'[Cancelado,Cerrado,Desierto]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (13,'curso','/cursos','image','Imagen del curso','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (13,'curso','/cursos','video','Video del curso','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (13,'curso','/cursos','title','Tìtulo','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (13,'curso','/cursos','content','Descripción del Curso','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (13,'curso','/cursos','link','Link para más información','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (14,'directiva','/directivas','periodo_resolucion','Año resolución','number','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (14,'directiva','/directivas','id_tipo_documento','Tipo de documento','endpoint','/documentostipo',2,'id');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (14,'directiva','/directivas','numero_resolucion','Número resolución','number','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (14,'directiva','/directivas','adicional_resolucion','Número adicional','char','',1,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (14,'directiva','/directivas','sumilla_resolucion','Sumilla de resolución','character','',1500,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (14,'directiva','/directivas','flag_adjunto','Tipo de adjunto','array','',3,'[URL,BIN]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (14,'directiva','/directivas','url_documento_resolucion','Link resolución','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (14,'directiva','/directivas','contenido_documento_resolucion','Documento Resolución','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (14,'directiva','/directivas','abreviacion_area','Abreviatura área','endpoint','/areas',2,'abreviacion_area');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (14,'directiva','/directivas','id_area','Id de area','endpoint','/areas',2,'id');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (15,'funcionario','/funcionarios','name','Nombre y apellido','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (15,'funcionario','/funcionarios','position','Cargo','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (15,'funcionario','/funcionarios','image','Imagen','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (15,'funcionario','/funcionarios','link','Link de más información','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (16,'memoria','/memorias','periodo_memoria','Año memoria','number','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (16,'memoria','/memorias','descripcion_memoria','Descripción de memoria','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (16,'memoria','/memorias','flag_adjunto','Tipo de adjunto','array','',3,'[URL,BIN]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (16,'memoria','/memorias','url_memoria','Link de memoria','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (16,'memoria','/memorias','contenido_memoria','Documento de memoria','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (17,'norma','/normas','tipo_norma','Tipo de norma','character','',255,'[Planes y Política,Instrumentos de Gestión]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (17,'norma','/normas','denominacion_norma','Denominación de norma','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (17,'norma','/normas','flag_adjunto','Tipo de adjunto','array','',3,'[URL,BIN]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (17,'norma','/normas','url_norma','Link de norma','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (17,'norma','/normas','contenido_norma','Documento norma','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (18,'noticia','/noticias','titulo_noticia','Tìtulo de noticia','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (18,'noticia','/noticias','descripcion_noticia','Descripción de noticia','character','',2000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (18,'noticia','/noticias','fecha_noticia','Fecha de noticia','character','',50,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (18,'noticia','/noticias','url_imagen_portada','Link de imagen de portada','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (19,'proyecto','/proyectos','image','Imagen proyecto','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (19,'proyecto','/proyectos','video','Video del proyecto','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (19,'proyecto','/proyectos','title','Tìtulo del proyecto','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (19,'proyecto','/proyectos','content','Descripción','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (19,'proyecto','/proyectos','link','Link del proyecto','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (20,'rendicion','/rendiciones','descripcion_rendicion','Descripción rendición','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (20,'rendicion','/rendiciones','periodo_rendicion','Año rendición','number','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (20,'rendicion','/rendiciones','flag_adjunto','Tipo de adjunto','array','',3,'[URL,BIN]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (20,'rendicion','/rendiciones','url_rendicion','Link de rendición','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (20,'rendicion','/rendiciones','contenido_rendicion','Documento de rendición','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (20,'resolucion','/resoluciones','periodo_resolucion','Periodo de resolución','number','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (21,'resolucion','/resoluciones','id_tipo_documento','Tipo de documento','endpoint','/documentostipo',2,'id');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (21,'resolucion','/resoluciones','numero_resolucion','Número resolución','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (21,'resolucion','/resoluciones','adicional_resolucion','Adicional resolución','char','',1,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (21,'resolucion','/resoluciones','sumilla_resolucion','Sumilla resolución','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (21,'resolucion','/resoluciones','flag_adjunto','Tipo de adjunto','array','',3,'[URL,BIN]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (21,'resolucion','/resoluciones','url_documento_resolucion','Link del documento resolución','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (21,'resolucion','/resoluciones','contenido_documento_resolucion','Documento de Resolución','bytea','',1000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (21,'resolucion','/resoluciones','abreviacion_area','Abreviatura área','endpoint','/areas',2,'abreviacion_area');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (21,'resolucion','/resoluciones','id_area','Id de area','endpoint','/areas',2,'id');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','tipo_servicio','Tipo de servicio','array','',10,'[TUPA,TUSNE]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','flag_construccion','Construido','array','',2,'[SI,NO]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','flag_calculo','flag_calculo','array','',1,'[0,1]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','requisitos_servicio','Requisitos del servicio','string','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','flag_metraje','Servicio se calcula?','array','',2,'[SI,NO]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','metraje_inicial','Metraje inicial','decimal','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','metraje_final','Metraje final','decimal','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','periodo_servicio','Periodo de servicio','number','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','numero_servicio','Número de servicio','number','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','sub_nivel_servicio','Sub nivel servicio','number','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','flag_seleccion','Servicio seleccionable?','array','',1,'[0,1]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','denominacion_servicio','Denominación de servicio','string','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','por_uit','Porcentaje de UIT','decimal','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','monto_soles','Monto en soles','decimal','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (22,'servicio','/servicios','monto_uit','Monto de UIT','decimal','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (7,'uit','/uits','periodo_uit','Periodo UIT','number','',4,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (7,'uit','/uits','moneda_uit','Moneda de UIT','array','',10,'[Soles,Dólares]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (7,'uit','/uits','valor_uit','Valor de UIT','number','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (7,'uit','/uits','base_legal','Base Legal','string','',30,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (8,'tipodocumento','/documentostipo','descripcion_tipo_documento','Descripción tipo de documento','string','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (8,'tipodocumento','/documentostipo','codigo_tramite_documentario','Código trámite documentario','char','',20,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (9,'usuario','/usuarios','name','Nombre completo del usuario','string','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (9,'usuario','/usuarios','email','Correo electrónico','string','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (9,'usuario','/usuarios','profile','Perfil de usuario','array','',20,'[Administrador,Creador,Autorizador]');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (9,'usuario','/usuarios','password','Clave','password','',10,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (23,'video','/videos','titulo_video','Título de video','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (23,'video','/videos','descripcion_video','Descripción de video','character','',2000,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (23,'video','/videos','fecha_video','Fecha de video','character','',50,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (23,'video','/videos','url_imagen_video','Link imagen del video','character','',255,'');
insert into campostablas (id_menu, tabla, endpoint_tabla, nombre_campo, titulo_campo, tipo, backend, ancho, valores) values (23,'video','/videos','url_video','Link del video','character','',255,'');
