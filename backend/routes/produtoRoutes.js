// produtoRoutes.js (Exemplo, crie se não tiver)
const express = require('express');
const router = express.Router();
const {
  getProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
  getProdutosEmDestaque,
  upload // Importar a instância do upload do controller
} = require('../controllers/produtoController');
const { protect, admin } = require('../middleware/authMiddleware'); // Certifique-se de que o caminho está correto

router.route('/')
  .get(getProdutos) // Público
  .post(protect, admin, upload.array('imagens', 5), createProduto); // Adicionar upload.array('imagens', 5)

router.route('/destaque').get(getProdutosEmDestaque); // Público

router.route('/:id')
  .get(getProdutoById) // Público
  .put(protect, admin, upload.array('imagens', 5), updateProduto) // Adicionar upload.array('imagens', 5)
  .delete(protect, admin, deleteProduto);

module.exports = router;