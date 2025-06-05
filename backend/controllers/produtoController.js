const Produto = require('../models/produtoModel');

// @desc    Buscar todos os produtos
// @route   GET /api/produtos
// @access  Public
const getProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find({});
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Buscar um produto pelo ID
// @route   GET /api/produtos/:id
// @access  Public
const getProdutoById = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    
    if (produto) {
      res.json(produto);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Criar um produto
// @route   POST /api/produtos
// @access  Private/Admin
const createProduto = async (req, res) => {
  try {
    const { nome, preco, descricao, imagens, marca, categoria, estoque } = req.body;

    const produto = await Produto.create({
      nome,
      preco,
      usuario: req.user._id,
      imagens,
      marca,
      categoria,
      estoque,
      descricao
    });

    if (produto) {
      res.status(201).json(produto);
    } else {
      res.status(400).json({ message: 'Dados de produto inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Atualizar um produto
// @route   PUT /api/produtos/:id
// @access  Private/Admin
const updateProduto = async (req, res) => {
  try {
    const { nome, preco, descricao, imagens, marca, categoria, estoque } = req.body;

    const produto = await Produto.findById(req.params.id);

    if (produto) {
      produto.nome = nome || produto.nome;
      produto.preco = preco || produto.preco;
      produto.descricao = descricao || produto.descricao;
      produto.imagens = imagens || produto.imagens;
      produto.marca = marca || produto.marca;
      produto.categoria = categoria || produto.categoria;
      produto.estoque = estoque || produto.estoque;

      const updatedProduto = await produto.save();
      res.json(updatedProduto);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Deletar um produto
// @route   DELETE /api/produtos/:id
// @access  Private/Admin
const deleteProduto = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (produto) {
      await Produto.deleteOne({ _id: produto._id });
      res.json({ message: 'Produto removido' });
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Buscar produtos em destaque
// @route   GET /api/produtos/destaque
// @access  Public
const getProdutosEmDestaque = async (req, res) => {
  try {
    // Encontra produtos onde 'emDestaque' é true
    const produtos = await Produto.find({ emDestaque: true });
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos em destaque.' });
  }
};

module.exports = {
  getProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
  getProdutosEmDestaque
};
