const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  itens: [
    {
      produto: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Produto'
      },
      nome: { type: String, required: true },
      quantidade: { type: Number, required: true },
      imagem: { type: String, required: true },
      preco: { type: Number, required: true }
    }
  ],
  enderecoEntrega: {
    endereco: { type: String, required: true },
    cidade: { type: String, required: true },
    cep: { type: String, required: true },
    estado: { type: String, required: true }
  },
  metodoPagamento: {
    type: String,
    required: true
  },
  valorTotal: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPago: {
    type: Boolean,
    required: true,
    default: false
  },
  dataPagemento: {
    type: Date
  },
  isEntregue: {
    type: Boolean,
    required: true,
    default: false
  },
  dataEntrega: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pedido', pedidoSchema);
