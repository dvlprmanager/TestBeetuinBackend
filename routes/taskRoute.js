const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  createTask,
  updatedTask,
  deactivateTask,
  getTasks,
  getTaskByid,
  getTaskByName, // Agregar la nueva función
} = require("../controllers/taskController");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

// Todas las rutas deben pasar por la validación del JWT
router.use(validarJWT);

// Ruta para crear una nueva tarea
router.post(
  "/newTask",
  [
    // middlewares
    check("name", "El Nombre es Obligatorio").not().isEmpty(),
    check("description", "La Descripción es Obligatoria").not().isEmpty(),
    check("createBy", "El Usuario que crea es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  createTask
);

// Ruta para actualizar una tarea existente
router.put(
  "/updateTask",
  [
    // middlewares
    check("idTask", "El ID de la Tarea es Obligatorio").isInt(),
    check("name", "El Nombre es Obligatorio").not().isEmpty(),
    check("description", "La Descripción es Obligatoria").not().isEmpty(),
    check("modifyBy", "El Usuario que modifica es obligatorio").not().isEmpty(),
    check("state", "El Estado es Obligatorio").isInt(),
    validarCampos,
  ],
  updatedTask
);

// Ruta para desactivar una tarea
router.put(
  "/update",
  [
    // middlewares
    check("idTask", "El ID de la Tarea es Obligatorio").isInt(),
    check("modifyBy", "El Usuario que modifica es obligatorio").not().isEmpty(),
    check("state", "El Estado es Obligatorio").isInt(),
    validarCampos,
  ],
  deactivateTask
);

// Ruta para obtener todas las tareas activas
router.get("/getTasks", getTasks);

// Ruta para obtener una tarea por ID
router.get(
  "/getTask/:uid",
  [check("uid", "El ID de usuario es Obligatorio").isInt(), validarCampos],
  getTaskByid
);

// Ruta para obtener una tarea por nombre (opcional)
router.get(
  "/getTaskByName/:name",
  [
    check("name", "El Nombre de la Tarea es Obligatorio").not().isEmpty(),
    validarCampos,
  ],
  getTaskByName
);

module.exports = router;
