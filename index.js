const express = require("express");
const cors = require("cors");
require("dotenv").config();

//Servidor express

const app = express();

//CORS

app.use(cors());

//Lectura y parseo del body

app.use(express.json());

//Rutas

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/task", require("./routes/taskRoute"));

//Escuchar peticiones

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en puerto ${process.env.PORT}`);
});
