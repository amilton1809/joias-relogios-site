import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaMoneyBill, FaBarcode } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    metodoPagamento: 'cartao'
  });
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Verificar se o usuário está logado
    if (!currentUser) {
      navigate('/login?redirect=checkout');
      return;
    }

    // Carregar itens do carrinho
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    
    setCartItems(items);
    setLoading(false);
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      // Validar campos obrigatórios
      if (!formData.endereco || !formData.cidade || !formData.estado || !formData.cep) {
        setError('Preencha todos os campos de endereço');
        setProcessing(false);
        return;
      }

      // Preparar dados do pedido
      const orderData = {
        itens: cartItems.map(item => ({
          produto: item._id,
          nome: item.nome,
          quantidade: item.quantidade,
          imagem: item.imagem,
          preco: item.preco
        })),
        enderecoEntrega: {
          endereco: formData.endereco,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep
        },
        metodoPagamento: formData.metodoPagamento,
        valorTotal: calculateTotal()
      };

      // Enviar pedido para a API
      const response = await axios.post('http://localhost:5000/api/pedidos', orderData);
      
      // Limpar carrinho
      localStorage.removeItem('cartItems');
      
      // Redirecionar para página de confirmação
      navigate(`/order-success/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao processar pedido');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Carregando checkout...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Finalizar Compra</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h3>Endereço de Entrega</h3>
              <div className="form-group">
                <label htmlFor="endereco">Endereço</label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  placeholder="Rua, número, complemento"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="estado">Estado</label>
                  <input
                    type="text"
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  required
                  placeholder="00000-000"
                />
              </div>
              
              <h3>Método de Pagamento</h3>
              <div className="payment-methods">
                <div className="payment-method">
                  <input
                    type="radio"
                    id="cartao"
                    name="metodoPagamento"
                    value="cartao"
                    checked={formData.metodoPagamento === 'cartao'}
                    onChange={handleChange}
                  />
                  <label htmlFor="cartao">
                    <FaCreditCard /> Cartão de Crédito
                  </label>
                </div>
                
                <div className="payment-method">
                  <input
                    type="radio"
                    id="boleto"
                    name="metodoPagamento"
                    value="boleto"
                    checked={formData.metodoPagamento === 'boleto'}
                    onChange={handleChange}
                  />
                  <label htmlFor="boleto">
                    <FaBarcode /> Boleto Bancário
                  </label>
                </div>
                
                <div className="payment-method">
                  <input
                    type="radio"
                    id="pix"
                    name="metodoPagamento"
                    value="pix"
                    checked={formData.metodoPagamento === 'pix'}
                    onChange={handleChange}
                  />
                  <label htmlFor="pix">
                    <FaMoneyBill /> PIX
                  </label>
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => navigate('/cart')}
                >
                  <FaArrowLeft /> Voltar para o Carrinho
                </button>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={processing}
                >
                  {processing ? 'Processando...' : 'Finalizar Pedido'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="order-summary">
            <h3>Resumo do Pedido</h3>
            
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item._id} className="order-item">
                  <div className="item-image">
                    <img src={item.imagem} alt={item.nome} />
                  </div>
                  <div className="item-details">
                    <h4>{item.nome}</h4>
                    <p>Quantidade: {item.quantidade}</p>
                    <p>R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-item">
                <span>Subtotal:</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
              <div className="total-item">
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
              <div className="total-item grand-total">
                <span>Total:</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
