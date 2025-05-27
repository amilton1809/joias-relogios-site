import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './header.css'

const Header = () => {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar itens do carrinho do localStorage
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>Joias & Relógios</h1>
            </Link>
          </div>
          
          <nav className="nav">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/produtos">Produtos</Link>
              </li>
              <li>
                <Link to="/produtos/joias">Joias</Link>
              </li>
              <li>
                <Link to="/produtos/relogios">Relógios</Link>
              </li>
            </ul>
          </nav>
          
          <div className="user-actions">
            <Link to="/cart" className="cart-icon">
              <FaShoppingCart />
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </Link>
            
            {currentUser ? (
              <div className="user-menu">
                <span className="user-name">Olá, {currentUser.nome}</span>
                
                {currentUser.isAdmin && (
                  <Link to="/admin" className="admin-link">
                    <FaUserShield /> Admin
                  </Link>
                )}
                
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt /> Sair
                </button>
              </div>
            ) : (
              <Link to="/login" className="user-icon">
                <FaUser />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
