-- Crear el esquema portal_icl si no existe
CREATE SCHEMA IF NOT EXISTS portal_icl;

-- Cambiar al esquema portal_icl
SET search_path TO portal_icl;

-- Crear la base de datos icl_web
CREATE DATABASE icl_web;

-- Cambiar al contexto de la base de datos icl_web
\c icl_web;

-- Crear la tabla "areas"
CREATE TABLE areas (
    id SMALLSERIAL PRIMARY KEY,
    descripcion_area VARCHAR,
    abreviacion_area CHAR(2),
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "categorias"
CREATE TABLE categorias (
    id SMALLSERIAL PRIMARY KEY,
    descripcion_categoria VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "convenios"
CREATE TABLE convenios (
    id SERIAL PRIMARY KEY,
    descripcion_convenio VARCHAR,
    url_documento_convenio VARCHAR,
    periodo_convenio INTEGER,
    numero_convenio INTEGER,
    autorizado CHAR(1) DEFAULT '0',
    autorizado_por VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "convocatorias"
CREATE TABLE convocatorias (
    id SERIAL PRIMARY KEY,
    descripcion_convocatoria VARCHAR(300),
    tipo_convocatoria VARCHAR,
    numero_convocatoria INTEGER,
    periodo_convocatoria INTEGER,
    url_anexos VARCHAR,
    url_comunicacion1 VARCHAR,
    url_comunicacion2 VARCHAR,
    url_comunicacion3 VARCHAR,
    url_aviso VARCHAR,
    url_resultado_evaluacion_curricular VARCHAR,
    url_resultado_examen VARCHAR,
    url_resultado_entrevista VARCHAR,
    url_puntaje_final VARCHAR,
    estado_convocatoria VARCHAR,
    autorizado CHAR(1) DEFAULT '0',
    autorizado_por VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "directivas"
CREATE TABLE directivas (
    id SERIAL PRIMARY KEY,
    periodo_resolucion INTEGER,
    numero_resolucion SMALLINT,
    adicional_resolucion CHAR(1),
    sumilla_resolucion VARCHAR(1500),
    url_documento_resolucion VARCHAR,
    autorizado CHAR(1) DEFAULT '0',
    autorizado_por VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "imagenes"
CREATE TABLE imagenes (
    id SERIAL PRIMARY KEY,
    url_imagen VARCHAR
);

-- Crear la tabla "normasinstitucionales"
CREATE TABLE normasinstitucionales (
    id SERIAL PRIMARY KEY,
    tipo_norma VARCHAR,
    denominacion_norma VARCHAR,
    url_norma VARCHAR,
    autorizado CHAR(1) DEFAULT '0',
    autorizado_por VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "noticias"
CREATE TABLE noticias (
    id SERIAL PRIMARY KEY,
    titulo_noticia VARCHAR,
    descripcion_noticia VARCHAR(2000),
    fecha_noticia VARCHAR,
    url_imagen_portada VARCHAR,
    autorizado CHAR(1) DEFAULT '0',
    autorizado_por VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "rendiciones"
CREATE TABLE rendiciones (
    id SERIAL PRIMARY KEY,
    descripcion_rendicion VARCHAR,
    periodo_rendicion INTEGER,
    url_rendicion VARCHAR,
    autorizado CHAR(1) DEFAULT '0',
    autorizado_por VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "resoluciones"
CREATE TABLE resoluciones (
    id SERIAL PRIMARY KEY,
    periodo_resolucion INTEGER,
    numero_resolucion SMALLINT,
    adicional_resolucion CHAR(1),
    sumilla_resolucion VARCHAR(1500),
    url_documento_resolucion VARCHAR,
    autorizado CHAR(1) DEFAULT '0',
    autorizado_por VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "servicios"
CREATE TABLE servicios (
    id SERIAL PRIMARY KEY,
    tipo_servicio VARCHAR,
    periodo_servicio INTEGER,
    numero_servicio SMALLINT,
    sub_nivel_servicio SMALLINT,
    flag_seleccion CHAR(1) DEFAULT '0',
    denominacion_servicio VARCHAR,
    por_uit DECIMAL,
    monto_soles DECIMAL,
    monto_uit DECIMAL,
    autorizado CHAR(1) DEFAULT '0',
    autorizado_por VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "tipodocumento"
CREATE TABLE tipodocumento (
    id SMALLSERIAL PRIMARY KEY,
    descripcion_tipo_documento VARCHAR,
    codigo_tramite_documentario VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "uits"
CREATE TABLE uits (
    id SMALLSERIAL PRIMARY KEY,
    periodo_uit INTEGER,
    moneda_uit VARCHAR,
    valor_uit INTEGER,
    base_legal VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Crear la tabla "videos"
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    titulo_video VARCHAR,
    descripcion_video VARCHAR,
    fecha_video VARCHAR,
    url_imagen_video VARCHAR,
    url_video VARCHAR,
    autorizado CHAR(1) DEFAULT '0',
    autorizado_por VARCHAR,
    activo CHAR(1) DEFAULT '1'
);

-- Definir relaciones entre las tablas (claves foráneas)
ALTER TABLE resoluciones
    ADD COLUMN id_tipo_documento SMALLINT REFERENCES tipodocumento(id);

ALTER TABLE directivas
    ADD COLUMN id_tipo_documento SMALLINT REFERENCES tipodocumento(id);

ALTER TABLE areas
    ADD COLUMN id_resolucion SMALLINT REFERENCES resoluciones(id);

ALTER TABLE areas
    ADD COLUMN id_directiva SMALLINT REFERENCES directivas(id);

ALTER TABLE categorias
    ADD COLUMN id_noticia SMALLINT REFERENCES noticias(id);

ALTER TABLE categorias
    ADD COLUMN id_video SMALLINT REFERENCES videos(id);

ALTER TABLE imagenes
    ADD COLUMN id_noticia SMALLINT REFERENCES noticias(id);

ALTER TABLE uits
    ADD COLUMN id_servicio SMALLINT REFERENCES servicios(id);

ALTER TABLE convocatorias
    ADD COLUMN id_tipo_documento SMALLINT REFERENCES tipodocumento(id);

ALTER TABLE convocatorias
    ADD COLUMN id_area SMALLSERIAL REFERENCES areas(id);

ALTER TABLE convenios
    ADD COLUMN id_area SMALLSERIAL REFERENCES areas(id);

ALTER TABLE directivas
    ADD COLUMN id_area SMALLSERIAL REFERENCES areas(id);

ALTER TABLE noticias
    ADD COLUMN id_categoria_noticia SMALLINT REFERENCES categorias(id);

ALTER TABLE videos
    ADD COLUMN id_categoria_video SMALLINT REFERENCES categorias(id);

ALTER TABLE resoluciones
    ADD COLUMN id_area SMALLSERIAL REFERENCES areas(id);
