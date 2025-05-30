import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './CartPage.css'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Carregar itens do carrinho do localStorage
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
    setLoading(false);
  }, []);

  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter(item => item._id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item._id === id ? { ...item, quantidade: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const calculateSubtotal = (item) => {
    return item.preco * item.quantidade;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateSubtotal(item), 0);
  };

  const handleCheckout = () => {
    if (!currentUser) {
      // Redirecionar para login se não estiver autenticado
      navigate('/login?redirect=checkout');
      return;
    }
    
    // Redirecionar para checkout
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container">
        <p>Carregando carrinho...</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Carrinho de Compras</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Seu carrinho está vazio</p>
            <Link to="/produtos" className="btn btn-primary">
              <FaArrowLeft /> Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                    <th>Subtotal</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item._id}>
                      <td className="product-info">
                        <img src={item.imagem} alt={item.nome} />
                        <Link to={`/product/${item._id}`}>{item.nome}</Link>
                      </td>
                      <td>R$ {item.preco.toFixed(2)}</td>
                      <td>
                        <div className="quantity-selector">
                          <button onClick={() => updateQuantity(item._id, item.quantidade - 1)}>-</button>
                          <input 
                            type="number" 
                            value={item.quantidade} 
                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                            min="1"
                          />
                          <button onClick={() => updateQuantity(item._id, item.quantidade + 1)}>+</button>
                        </div>
                      </td>
                      <td>R$ {calculateSubtotal(item).toFixed(2)}</td>
                      <td>
                        <button className="btn-remove" onClick={() => removeFromCart(item._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="cart-summary">
              <h3>Resumo do Pedido</h3>
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
              <div className="summary-item total">
                <span>Total:</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
              
              <button 
                className="btn btn-primary btn-block"
                onClick={handleCheckout}
              >
                <FaArrowRight /> Finalizar Compra
              </button>
              
              <Link to="/produtos" className="btn btn-outline btn-block">
                <FaArrowLeft /> Continuar Comprando
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
