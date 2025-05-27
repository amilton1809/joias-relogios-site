const express = require('express');
const router = express.Router();
const { 
  criarPedido, 
  getPedidoById, 
  atualizarPedidoPago, 
  getMeusPedidos, 
  getPedidos 
} = require('../controllers/pedidoController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rotas para usuários autenticados
router.route('/').post(protect, criarPedido).get(protect, admin, getPedidos);
router.route('/meuspedidos').get(protect, getMeusPedidos);
router.route('/:id').get(protect, getPedidoById);
router.route('/:id/pagar').put(protect, atualizarPedidoPago);

module.exports = router;
