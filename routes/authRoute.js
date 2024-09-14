const express = require("express");

const router = express.Router();
const { check } = require("express-validator");
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require("../controllers/authController");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

router.post(
  "/new",
  [
    // middlewares
    check("name", "El Nombre es Obligatorio").not().isEmpty(),
    check("email", "El Email es Obligatorio").isEmail(),
    check("password", "El Password debe de ser 6 caracteres").isLength({
      min: 6,
    }),
    check("createBy", "El Usuario que crea es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  "/login",
  [
    // middlewares
    check("email", "El Email es Obligatorio").isEmail(),
    check("password", "El Password debe de ser 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUsuario
);

router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
