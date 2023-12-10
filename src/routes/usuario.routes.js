import { Router } from "express";
import passport from "passport";
import '../middlewares/passport.js';
import { iniciarSesion, registrarUsuario, actualizarUsuario, obtenerUsuarioPorId, obtenerUsuarios, activarUsuario, desactivarUsuario } from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/users", passport.authenticate("jwt", { session: false }), obtenerUsuarios);

router.get("/users/:id",passport.authenticate("jwt", { session: false }), obtenerUsuarioPorId);

router.post("/users", passport.authenticate("jwt", { session: false }), registrarUsuario);
router.post("/signin", iniciarSesion);
router.put("/users/:id", passport.authenticate("jwt", { session: false }),actualizarUsuario);
router.put('/activarusers/:id',passport.authenticate("jwt", { session: false }),activarUsuario);
router.put('/desactivarusers/:id',passport.authenticate("jwt", { session: false }), desactivarUsuario);

export default router;