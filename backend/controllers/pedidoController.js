const Pedido = require('../models/pedidoModel');

// @desc    Criar novo pedido
// @route   POST /api/pedidos
// @access  Private
const criarPedido = async (req, res) => {
  try {
    const { 
      itens, 
      enderecoEntrega, 
      metodoPagamento, 
      valorTotal 
    } = req.body;

    if (itens && itens.length === 0) {
      res.status(400).json({ message: 'Nenhum item no pedido' });
      return;
    }

    const pedido = new Pedido({
      usuario: req.user._id,
      itens,
      enderecoEntrega,
      metodoPagamento,
      valorTotal
    });

    const pedidoCriado = await pedido.save();
    res.status(201).json(pedidoCriado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obter pedido por ID
// @route   GET /api/pedidos/:id
// @access  Private
const getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate(
      'usuario',
      'nome email'
    );

    if (pedido) {
      // Verificar se o pedido pertence ao usuário ou se é admin
      if (pedido.usuario._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401).json({ message: 'Não autorizado' });
        return;
      }
      
      res.json(pedido);
    } else {
      res.status(404).json({ message: 'Pedido não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Atualizar pedido para pago
// @route   PUT /api/pedidos/:id/pagar
// @access  Private
const atualizarPedidoPago = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);

    if (pedido) {
      pedido.isPago = true;
      pedido.dataPagamento = Date.now();

      const pedidoAtualizado = await pedido.save();
      res.json(pedidoAtualizado);
    } else {
      res.status(404).json({ message: 'Pedido não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obter pedidos do usuário logado
// @route   GET /api/pedidos/meuspedidos
// @access  Private
const getMeusPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuario: req.user._id });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obter todos os pedidos
// @route   GET /api/pedidos
// @access  Private/Admin
const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({}).populate('usuario', 'id nome');
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  criarPedido,
  getPedidoById,
  atualizarPedidoPago,
  getMeusPedidos,
  getPedidos
};
