import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Usuario } from "../models/Usuario.js"; // Ajusta la importación según tu estructura de archivos

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'Icl2023@vamos', // Reemplaza con tu propia clave secreta
};

const jwtStrategy = new Strategy(opts, async (payload, done) => {
  try {
    const usuario = await Usuario.findByPk(payload.userId);
    if (usuario) {
      return done(null, usuario);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

passport.use(jwtStrategy);
