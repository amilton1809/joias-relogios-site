const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/joias_relogios')
  .then(() => console.log('MongoDB Conectado'))
  .catch(err => console.error(`Erro na conexão com MongoDB: ${err.message}`));

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.json({ message: 'API de Joias e Relógios funcionando!' });
});

// Definir porta
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
});
