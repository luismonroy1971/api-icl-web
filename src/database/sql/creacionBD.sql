-- Crear el esquema portal_icl si no existe
CREATE SCHEMA IF NOT EXISTS portal_icl;

-- Cambiar al esquema portal_icl
SET search_path TO portal_icl;

-- Crear la base de datos icl_web
CREATE DATABASE icl_web;

-- Cambiar al contexto de la base de datos icl_web
\c icl_web;

-- Creación de tablas

CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  descripcion_area VARCHAR(255),
  abreviacion_area CHAR(2),
  activo CHAR(1) DEFAULT '1'
);

-- 2. Tabla 'campostablas'
CREATE TABLE campostablas (
  id SERIAL PRIMARY KEY,
  id_menu smallint,
  tabla VARCHAR(255),
  nombre_campo VARCHAR(50),
  tipo VARCHAR(15),
  backend VARCHAR(50),
  ancho INTEGER,
  valores VARCHAR(100)
);

-- 3. Tabla 'categorias'
CREATE TABLE categorias (
  id SMALLINT PRIMARY KEY,
  descripcion_categoria VARCHAR(255),
  activo CHAR(1) DEFAULT '1'
);

-- 4. Tabla 'convenios'
CREATE TABLE convenios (
  id INTEGER PRIMARY KEY,
  descripcion_convenio VARCHAR(255),
  url_documento_convenio VARCHAR(255),
  fecha_convenio DATE,
  periodo_convenio INTEGER,
  periodo_mes INTEGER,
  id_departamento smallint,
  id_provincia smallint,
  id_distrito smallint,
  creado_por VARCHAR(255),
  creado_fecha DATE,
  modificado_por VARCHAR(255),
  modificado_fecha DATE,
  autorizado CHAR(1) DEFAULT '0',
  autorizado_por VARCHAR(255),
  autorizado_fecha DATE,
  activo CHAR(1) DEFAULT '1'
);

-- 5. Tabla 'convocatorias'
CREATE TABLE convocatorias (
  id INTEGER PRIMARY KEY,
  descripcion_convocatoria VARCHAR(300),
  tipo_convocatoria VARCHAR,
  id_area smallint,
  numero_convocatoria INTEGER,
  periodo_convocatoria INTEGER,
  url_anexos VARCHAR(255),
  url_comunicacion1 VARCHAR(255),
  url_comunicacion2 VARCHAR(255),
  url_comunicacion3 VARCHAR(255),
  url_aviso VARCHAR(255),
  url_resultado_evaluacion_curricular VARCHAR(255),
  url_resultado_examen VARCHAR(255),
  url_resultado_entrevista VARCHAR(255),
  url_puntaje_final VARCHAR(255),
  estado_convocatoria VARCHAR(50),
  creado_por VARCHAR(255),
  creado_fecha DATE,
  modificado_por VARCHAR(255),
  modificado_fecha DATE,
  autorizado CHAR(1) DEFAULT '0',
  autorizado_por VARCHAR(255),
  autorizado_fecha DATE,
  activo CHAR(1) DEFAULT '1'
);

-- 6. Tabla 'cursos'
CREATE TABLE cursos (
  id INTEGER PRIMARY KEY,
  image VARCHAR(255),
  video VARCHAR(255),
  title VARCHAR(255),
  content TEXT,
  link VARCHAR(255),
  creado_por VARCHAR(255),
  creado_fecha DATE,
  modificado_por VARCHAR(255),
  modificado_fecha DATE,
  autorizado CHAR(1) DEFAULT '0',
  autorizado_por VARCHAR(255),
  autorizado_fecha DATE,
  activo CHAR(1) DEFAULT '1'
);

-- 7. Tabla 'departamentos'
CREATE TABLE departamentos (
  id SMALLINT PRIMARY KEY,
  departamento VARCHAR(255)
);

-- 8. Tabla 'directivas'
CREATE TABLE directivas (
  id INTEGER PRIMARY KEY,
  periodo_resolucion INTEGER,
  id_tipo_documento smallint,
  numero_resolucion SMALLINT,
  adicional_resolucion CHAR(1),
  sumilla_resolucion VARCHAR(1500),
  url_documento_resolucion VARCHAR(255),
  id_area smallint,
  abreviacion_area CHAR(2),
  creado_por VARCHAR(255),
  creado_fecha DATE,
  modificado_por VARCHAR(255),
  modificado_fecha DATE,
  autorizado CHAR(1) DEFAULT '0',
  autorizado_por VARCHAR(255),
  autorizado_fecha DATE,
  activo CHAR(1) DEFAULT '1'
);

-- 9. Tabla 'distritos'
CREATE TABLE distritos (
  id SMALLINT PRIMARY KEY,
  distrito VARCHAR(255),
  ubigeo VARCHAR(255),
  id_departamento smallint,
  id_provincia smallint
);

-- 10. Tabla 'funcionarios'
CREATE TABLE funcionarios (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255),
  position VARCHAR(255),
  image VARCHAR(255),
  link TEXT,
  creado_por VARCHAR(255),
  creado_fecha DATE,
  modificado_por VARCHAR(255),
  modificado_fecha DATE,
  autorizado CHAR(1) DEFAULT '0',
  autorizado_por VARCHAR(255),
  autorizado_fecha DATE,
  activo CHAR(1) DEFAULT '1'
);

-- 11. Tabla 'imagenes'
CREATE TABLE imagenes (
  id INTEGER PRIMARY KEY,
  url_imagen VARCHAR(255),
  activo CHAR(1) DEFAULT '1',
  id_noticia smallint
);

-- 12. Tabla 'memorias'
CREATE TABLE memorias (
  id INTEGER PRIMARY KEY,
  periodo_memoria INTEGER,
  descripcion_memoria VARCHAR(255),
  url_memoria VARCHAR(255),
  creado_por VARCHAR(255),
  creado_fecha DATE,
  modificado_por VARCHAR(255),
  modificado_fecha DATE,
  autorizado CHAR(1) DEFAULT '0',
  autorizado_por VARCHAR(255),
  autorizado_fecha DATE,
  activo CHAR(1) DEFAULT '1'
);

-- 13. Tabla 'menus'
CREATE TABLE menus (
  id INTEGER PRIMARY KEY,
  primer_nivel CHAR(2),
  segundo_nivel CHAR(2),
  nombre_menu VARCHAR(50),
  etiqueta_menu VARCHAR(20),
  descripcion_menu VARCHAR(300),
  url VARCHAR(255)
);

-- 14. Tabla 'normasinstitucionales'
CREATE TABLE normasinstitucionales (
  id INTEGER PRIMARY KEY,
  tipo_norma VARCHAR(50),
  denominacion_norma VARCHAR(255),
  url_norma VARCHAR(255)
);

-- 15. Tabla 'noticias'
CREATE TABLE noticias (
  id INTEGER PRIMARY KEY,
  titulo_noticia VARCHAR(255),
  id_categoria smallint,
  descripcion_noticia VARCHAR(2000),
  fecha_noticia VARCHAR(255),
  url_imagen_portada VARCHAR(255)
);

-- 16. Tabla 'opcionesusuarios'
CREATE TABLE opcionesusuarios (
  id INTEGER PRIMARY KEY,
	id_menu smallint,
	id_usuario smallint
);

-- 17. Tabla 'provincias'
CREATE TABLE provincias (
  id SMALLINT PRIMARY KEY,
  provincia VARCHAR(255),
  id_departamento smallint
);

-- 18. Tabla 'proyectos'
CREATE TABLE proyectos (
  id INTEGER PRIMARY KEY,
  image VARCHAR(255),
  video VARCHAR(255),
  title VARCHAR(255),
  content TEXT,
  link VARCHAR(255)
);

-- 19. Tabla 'rendiciones'
CREATE TABLE rendiciones (
  id INTEGER PRIMARY KEY,
  descripcion_rendicion VARCHAR(255),
  periodo_rendicion INTEGER,
  url_rendicion VARCHAR(255)
);

-- 20. Tabla 'resoluciones'
CREATE TABLE resoluciones (
  id INTEGER PRIMARY KEY,
  periodo_resolucion INTEGER,
  id_tipo_documento smallint,
  numero_resolucion SMALLINT,
  adicional_resolucion CHAR(1),
  id_area smallint,
  sumilla_resolucion VARCHAR(1500),
  url_documento_resolucion VARCHAR(255),
  abreviacion_area CHAR(2)
);

-- 21. Tabla 'servicios'
CREATE TABLE servicios (
  id INTEGER PRIMARY KEY,
  tipo_servicio VARCHAR(50),
  flag_construccion CHAR(2),
  flag_calculo CHAR(1),
  requisitos_servicio VARCHAR(255),
  flag_metraje CHAR(2),
  metraje_inicial DECIMAL,
  metraje_final DECIMAL,
  periodo_servicio INTEGER,
  numero_servicio SMALLINT,
  sub_nivel_servicio SMALLINT,
  flag_seleccion CHAR(1) DEFAULT '0',
  denominacion_servicio VARCHAR(255),
  por_uit DECIMAL,
  monto_soles DECIMAL,
  monto_uit DECIMAL
);
-- Crear la tabla 'tipodocumentos'
CREATE TABLE tipodocumentos (
    id SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    descripcion_tipo_documento VARCHAR(255),
    codigo_tramite_documentario VARCHAR(255),
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla 'uits'
CREATE TABLE uits (
    id SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    periodo_uit INTEGER,
    moneda_uit VARCHAR(100),
    valor_uit INTEGER,
    base_legal VARCHAR(100),
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla 'usuarios'
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100),
    email VARCHAR(100),
    profile VARCHAR(100),
    password VARCHAR(100),
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla 'videos'
CREATE TABLE videos (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    titulo_video VARCHAR(100),
	id_categoria smallint,
    descripcion_video VARCHAR(500),
    fecha_video VARCHAR(50),
    url_imagen_video VARCHAR(255),
    url_video VARCHAR(255),
    creado_por VARCHAR(100),
    creado_fecha DATE,
    modificado_por VARCHAR(100),
    modificado_fecha DATE,
    autorizado CHAR(1) DEFAULT '0',
    autorizado_por VARCHAR(100),
    autorizado_fecha DATE,
    activo CHAR(1) DEFAULT '1'
);


-- Definir relaciones entre las tablas (claves foráneas)
-- Restriciones de clave foránea

-- 1. Relación entre 'areas' y 'Resolucion'
ALTER TABLE Resoluciones
ADD CONSTRAINT fk_resolucion_area
FOREIGN KEY (id_area)
REFERENCES areas (id);

-- 2. Relación entre 'areas' y 'Directiva'
ALTER TABLE Directivas
ADD CONSTRAINT fk_directiva_area
FOREIGN KEY (id_area)
REFERENCES areas (id);

-- 3. Relación entre 'areas' y 'Convocatoria'
ALTER TABLE Convocatorias
ADD CONSTRAINT fk_convocatoria_area
FOREIGN KEY (id_area)
REFERENCES areas (id);

-- 4. Relación entre 'camposTablas' y 'Menu'
ALTER TABLE camposTablas
ADD CONSTRAINT fk_camposTablas_menu
FOREIGN KEY (id_menu)
REFERENCES menus (id);

-- 5. Relación entre 'categorias' y 'Noticia'
ALTER TABLE Noticias
ADD CONSTRAINT fk_noticia_categoria
FOREIGN KEY (id_categoria)
REFERENCES categorias (id);

-- 6. Relación entre 'categorias' y 'Video'
ALTER TABLE Videos
ADD CONSTRAINT fk_video_categoria
FOREIGN KEY (id_categoria)
REFERENCES categorias (id);

-- 7. Relación entre 'convenios' y 'Departamento'
ALTER TABLE Convenios
ADD CONSTRAINT fk_convenio_departamento
FOREIGN KEY (id_departamento)
REFERENCES departamentos (id);

-- 8. Relación entre 'convenios' y 'Provincia'
ALTER TABLE Convenios
ADD CONSTRAINT fk_convenio_provincia
FOREIGN KEY (id_provincia)
REFERENCES provincias (id);

-- 11. Relación entre 'distritos' y 'Convenio'
ALTER TABLE Convenios
ADD CONSTRAINT fk_convenio_distrito
FOREIGN KEY (id_distrito)
REFERENCES distritos (id);

-- 13. Relación entre 'imagenes' y 'Noticia'
ALTER TABLE imagenes
ADD CONSTRAINT fk_imagen_noticia
FOREIGN KEY (id_noticia)
REFERENCES Noticias (id);

-- 14. Relación entre 'menus' y 'OpcionesUsuario'
ALTER TABLE opcionesusuarios
ADD CONSTRAINT fk_opcionesusuario_menu
FOREIGN KEY (id_menu)
REFERENCES menus (id);


-- Agregar columna de clave foránea 'id_provincia' a la tabla 'distritos'
ALTER TABLE distritos
ADD CONSTRAINT fk_distritos_provincia
FOREIGN KEY (id_provincia)
REFERENCES provincias (id);

ALTER TABLE Resoluciones
ADD CONSTRAINT fk_resolucion_tipodocumento
FOREIGN KEY (id_tipo_documento)
REFERENCES tipodocumentos (id);

ALTER TABLE Directivas
ADD CONSTRAINT fk_directiva_tipodocumento
FOREIGN KEY (id_tipo_documento)
REFERENCES tipodocumentos (id);

-- Agregar columna de clave foránea 'id_usuario' a la tabla 'opcionesusuario'
ALTER TABLE opcionesusuarios
ADD CONSTRAINT fk_opcionesusuario_usuario
FOREIGN KEY (id_usuario)
REFERENCES usuarios (id);
