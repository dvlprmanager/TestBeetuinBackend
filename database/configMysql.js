const mysql = require("mysql2/promise");

const dbConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("DB Online");
    return connection;
  } catch (error) {
    console.error("Error en la conexión de la base de datos:", error);
    throw new Error("Error en la conexión de la base de datos");
  }
};

module.exports = {
  dbConnection,
};
