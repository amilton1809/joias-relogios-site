const express = require('express');
const router = express.Router();
const { 
  getProdutos, 
  getProdutoById, 
  createProduto, 
  updateProduto, 
  deleteProduto 
} = require('../controllers/produtoController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/', getProdutos);
router.get('/:id', getProdutoById);

// Rotas protegidas para administradores
router.post('/', protect, admin, createProduto);
router.put('/:id', protect, admin, updateProduto);
router.delete('/:id', protect, admin, deleteProduto);

module.exports = router;
