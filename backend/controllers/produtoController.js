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
    const { nome, preco, descricao, imagens, marca, categoria, estoque, emDestaque } = req.body; // <-- Adicionado emDestaque

    const produto = await Produto.create({
      nome,
      preco,
      usuario: req.user._id, // Assumindo que você quer vincular o produto a um usuário admin
      imagens,
      marca,
      categoria,
      estoque,
      descricao,
      emDestaque // <-- Adicionado emDestaque
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
  const { 
    nome, 
    preco, 
    descricao, 
    imagens, 
    marca, 
    categoria, 
    estoque, 
    emDestaque // <--- ESTE É O CAMPO CRÍTICO QUE FOI ADICIONADO AQUI
  } = req.body;

  try {
    const produto = await Produto.findById(req.params.id);

    if (produto) {
      produto.nome = nome !== undefined ? nome : produto.nome;
      produto.preco = preco !== undefined ? preco : produto.preco;
      produto.descricao = descricao !== undefined ? descricao : produto.descricao;
      produto.imagens = imagens !== undefined ? imagens : produto.imagens; // Pode ser um array vazio []
      produto.marca = marca !== undefined ? marca : produto.marca;
      produto.categoria = categoria !== undefined ? categoria : produto.categoria;
      produto.estoque = estoque !== undefined ? estoque : produto.estoque;
      // ATUALIZAÇÃO DO CAMPO emDestaque:
      produto.emDestaque = emDestaque !== undefined ? emDestaque : produto.emDestaque; // <--- CORREÇÃO AQUI

      const updatedProduto = await produto.save();
      res.json(updatedProduto);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
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
  updateProduto, // Exporta a função atualizada
  deleteProduto,
  getProdutosEmDestaque
};