require('express-async-errors')
require('dotenv/config')

const AppError = require('./utils/AppError')
const uploadConfig = require('./config/upload')
const path = require('path');

// Inicializando o banco de dados e criando as tabelas necessárias quando a aplicação for inicializada.
const migrationsDatabase = require('./database/sqlite/migrations')
migrationsDatabase()

// Criando a aplicação baseada em NodeJS express.
const express = require('express');
const routes = require('./routes')
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());
app.use(routes)

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

// Configurando a aplicação para utilizar uma classe chamada AppError cujo irá retornar os erros do NodeJS express.
app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'Error',
      message: error.message
    })
  }

  return res.status(500).json({
    status: 'Error',
    message: 'Internal Server Error'
  })
})

app.get('/tmp/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../tmp/uploads', filename);
  res.sendFile(imagePath);
});

// Informando em qual porta de rede a aplicação irá funcionar.
const port = process.env.PORT
app.listen(port, () => {
  console.log(`ReactFood running in port ${port}`);
})