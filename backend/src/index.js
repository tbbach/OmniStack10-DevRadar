const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setupWebsocket } = require('./websockets');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect(
  'MONGODB_CONNECTION_STRING',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);

// Métodos HTTP: GET, POST, PUT, DELETE

//Tipos de parâmetros:

// Query Params: request.query (Filtros, ordenação, paginação, ...)
// Route Params: request.params (Identificar um recurso na alteração ou remoção)
// Body:         request.body (Dados para criação ou alteração de um registro)

// MongoDB (Não-relacional)
