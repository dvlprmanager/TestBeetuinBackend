const { response } = require("express");
const { dbConnection } = require("../database/configMysql");

// Crear nueva tarea
const createTask = async (req, res = response) => {
  const { name, description, createBy, state } = req.body;

  try {
    const connection = await dbConnection();

    // Insertar nueva tarea
    const [result] = await connection.execute(
      "CALL sp_task(NULL, ?, ?, ?, NULL, ?, 1)",
      [name, description, createBy, state]
    );

    const newTask = result[0][0];

    res.status(201).json({
      Creado: true,
      idTask: newTask.idTask,
      name: newTask.name,
      description: newTask.description,
      createBy: newTask.createBy,
      state: newTask.state,
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

// Actualizar tarea existente
const updatedTask = async (req, res = response) => {
  const { idTask, name, description, modifyBy, state } = req.body;

  try {
    const connection = await dbConnection();

    // Actualizar tarea existente
    const [result] = await connection.execute(
      "CALL sp_task(?, ?, ?, NULL, ?, ?, 2)",
      [idTask, name, description, modifyBy, state]
    );

    const updatedTask = result[0][0];

    res.status(200).json({
      Actualizado: true,
      idTask: updatedTask.idTask,
      name: updatedTask.name,
      description: updatedTask.description,
      modifyBy: updatedTask.modifyBy,
      state: updatedTask.state,
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

// Desactivar tarea
const deactivateTask = async (req, res = response) => {
  const { idTask, modifyBy, state } = req.body;

  try {
    const connection = await dbConnection();

    // Desactivar tarea (cambiar estado)
    const [result] = await connection.execute(
      "CALL sp_task(?, NULL, NULL, NULL, ?, ?, 3)",
      [idTask, modifyBy, state]
    );

    res.status(200).json({
      Desactivado: true,
      idTask: idTask,
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

// Consultar todas las tareas activas
const getTasks = async (req, res = response) => {
  try {
    const connection = await dbConnection();

    // Consultar todas las tareas activas
    const [result] = await connection.execute(
      "CALL sp_task(NULL, NULL, NULL, NULL, NULL, NULL, 4)"
    );

    res.status(200).json({
      Tareas: result[0],
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

// Consultar tarea por ID de usuario
const getTaskByid = async (req, res = response) => {
  console.log(req);
  const { uid } = req.params;

  try {
    const connection = await dbConnection();
    console.log(uid);
    // Consultar tarea por ID
    const [result] = await connection.execute(
      "CALL sp_task(NULL, NULL, NULL, ?, NULL, NULL, 5)",
      [uid]
    );

    if (result[0].length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Tarea no encontrada",
      });
    }

    res.status(200).json({
      Tareas: result[0],
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

// Consultar tarea por nombre (opcional)
const getTaskByName = async (req, res = response) => {
  const { name } = req.params;

  try {
    const connection = await dbConnection();

    // Consultar tarea por nombre
    const [result] = await connection.execute(
      "CALL sp_task(NULL, ?, NULL, NULL, NULL, NULL, 6)",
      [name]
    );

    res.status(200).json({
      Tareas: result[0],
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

module.exports = {
  createTask,
  updatedTask,
  deactivateTask,
  getTasks,
  getTaskByid,
  getTaskByName, // Exportar la nueva función si se requiere
};
