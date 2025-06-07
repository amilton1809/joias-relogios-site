const Produto = require('../models/produtoModel');
const multer = require('multer'); //
const path = require('path'); //
const fs = require('fs'); //

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/product_images');
    // Cria o diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Garante que o nome do arquivo seja único
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

// Instância do Multer para upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Limite de 5MB por arquivo
});

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
    const { nome, preco, descricao, marca, categoria, estoque, emDestaque, existingImages } = req.body;
    let newImageUrls = [];

    // Se houver arquivos uploaded, adicione suas URLs
    if (req.files && req.files.length > 0) {
      newImageUrls = req.files.map(file => `/uploads/product_images/${file.filename}`);
    }

    // Combina as URLs existentes (se houver e vierem do frontend) com as novas URLs de upload
    const finalImageUrls = [];

    // Adiciona URLs de imagens existentes se forem enviadas
    if (existingImages) {
        if (Array.isArray(existingImages)) {
            finalImageUrls.push(...existingImages.filter(url => url.trim() !== ''));
        } else if (typeof existingImages === 'string' && existingImages.trim() !== '') {
            finalImageUrls.push(existingImages);
        }
    }
    // Adiciona URLs das imagens recém-uploadeadas
    finalImageUrls.push(...newImageUrls);

    const produto = await Produto.create({
      nome,
      preco,
      usuario: req.user._id, // Assumindo que req.user é definido pelo authMiddleware
      imagens: finalImageUrls, // Agora salva as URLs dos arquivos carregados e as URLs existentes
      marca,
      categoria,
      estoque,
      descricao,
      emDestaque
    });

    if (produto) {
      res.status(201).json(produto);
    } else {
      res.status(400).json({ message: 'Dados de produto inválidos' });
    }
  } catch (error) {
    console.error('Erro ao criar produto:', error);
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
    marca,
    categoria,
    estoque,
    emDestaque,
    existingImages // Recebe as URLs existentes do frontend
  } = req.body;

  try {
    const produto = await Produto.findById(req.params.id);

    if (produto) {
      produto.nome = nome !== undefined ? nome : produto.nome;
      produto.preco = preco !== undefined ? preco : produto.preco;
      produto.descricao = descricao !== undefined ? descricao : produto.descricao;

      let newImageUrls = [];
      // Processa novos uploads
      if (req.files && req.files.length > 0) {
        newImageUrls = req.files.map(file => `/uploads/product_images/${file.filename}`);
      }

      // Combina as URLs existentes (que o frontend enviou) com as URLs dos novos uploads
      const finalImageUrls = [];

      // Adiciona URLs de imagens existentes se forem enviadas
      if (existingImages) {
          // existingImages pode vir como string se for um único item, ou array se múltiplos
          if (Array.isArray(existingImages)) {
              finalImageUrls.push(...existingImages.filter(url => url.trim() !== ''));
          } else if (typeof existingImages === 'string' && existingImages.trim() !== '') {
              finalImageUrls.push(existingImages);
          }
      }
      // Adiciona URLs das imagens recém-uploadeadas
      finalImageUrls.push(...newImageUrls);

      produto.imagens = finalImageUrls; // Atualiza o array de imagens do produto

      produto.marca = marca !== undefined ? marca : produto.marca;
      produto.categoria = categoria !== undefined ? categoria : produto.categoria;
      produto.estoque = estoque !== undefined ? estoque : produto.estoque;
      produto.emDestaque = emDestaque !== undefined ? emDestaque : produto.emDestaque;

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
  getProdutosEmDestaque,
  upload // Exporta a instância do multer para uso nas rotas
};