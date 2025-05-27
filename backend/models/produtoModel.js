const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true,
    enum: ['joias', 'relogios']
  },
  preco: {
    type: Number,
    required: true,
    default: 0
  },
  estoque: {
    type: Number,
    required: true,
    default: 0
  },
  imagens: [
    {
      type: String
    }
  ],
  marca: {
    type: String,
    required: true
  },
  emDestaque: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Produto', produtoSchema);
