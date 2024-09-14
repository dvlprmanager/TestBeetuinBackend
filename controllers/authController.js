const { response } = require("express");
const bcrypt = require("bcryptjs");
const { dbConnection } = require("../database/configMysql");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password, name, createBy } = req.body;

  try {
    const connection = await dbConnection();

    // Verificar si el usuario existe
    const [rows] = await connection.execute(
      "CALL sp_user(NULL, ?, ?, ?, ?, NULL, 1, 6)",
      [name, email, password, createBy]
    );

    console.log(rows[0][0]);

    if (rows[0].length > 0) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario ya existe con ese correo",
      });
    }

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Crear nuevo usuario
    const [newUser] = await connection.execute(
      "CALL sp_user(NULL, ?, ?, ?, ?, NULL, 1, 1)",
      [name, email, hashedPassword, createBy]
    );

    const usuario = newUser[0][0];

    // Generar el JWT
    const token = await generarJWT(usuario.idUser, usuario.name);

    res.status(201).json({
      Creado: true,
      uid: usuario.idUser,
      name: usuario.name,
      token,
    });

    // Cerrar la conexión
    await connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con su administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const connection = await dbConnection();

    // Verificar si el usuario existe
    const [rows] = await connection.execute(
      "CALL sp_user(NULL, NULL, ?, NULL, NULL, NULL, NULL, 6)",
      [email]
    );

    console.log(rows[0][0]);

    if (rows[0].length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    const usuario = rows[0][0];

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.idUser, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.idUser,
      name: usuario.name,
      token,
    });

    // Cerrar la conexión
    await connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con su administrador",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const uid = req.uid;
  const name = req.name;

  const token = await generarJWT(uid, name);

  res.json({
    login: true,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
