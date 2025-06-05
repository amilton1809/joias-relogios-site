// frontend/src/pages/ProductPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Adicionado useNavigate e Link
import { FaShoppingCart, FaStar, FaArrowLeft } from 'react-icons/fa'; // Adicionado FaArrowLeft
import axios from 'axios';
import './ProductPage.css'; // MANTENHA A IMPORTAÇÃO DO CSS AQUI

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_BASE_URL}/produtos/${id}`);
        setProduct(response.data);
        if (response.data.imagens && response.data.imagens.length > 0) {
          setActiveImage(0);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar o produto. Tente novamente mais tarde.');
        console.error('Erro ao buscar produto:', err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item._id === product._id);
    if (existingItem) {
      const updatedItems = cartItems.map(item => 
        item._id === product._id 
          ? { ...item, quantidade: item.quantidade + quantity } 
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    } else {
      const newItem = {
        _id: product._id,
        nome: product.nome,
        preco: product.preco,
        imagem: product.imagens[0],
        quantidade: quantity
      };
      localStorage.setItem('cartItems', JSON.stringify([...cartItems, newItem]));
    }
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="product-page">
        <div className="container">
          <p>Carregando detalhes do produto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-page">
        <div className="container">
          <p className="error-message">{error || 'Produto não encontrado'}</p>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            <FaArrowLeft /> Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; 
          <Link to={`/produtos/${product.categoria}`}>
            {product.categoria === 'joias' ? 'Joias' : 'Relógios'}
          </Link> &gt; 
          <span>{product.nome}</span>
        </div>

        <div className="product-details">
          <div className="product-gallery">
            <div className="main-image">
              {/* === ADICIONADO ESTILO INLINE AQUI PARA TESTE === */}
              <img 
                src={product.imagens[activeImage] || 'https://via.placeholder.com/600'} 
                alt={product.nome} 
                style={{ 
                  maxWidth: '300px', // Reduza este valor se ainda estiver grande
                  height: 'auto',
                  display: 'block',
                  border: '5px solid red' // Apenas para um feedback visual claro
                }}
              />
            </div>
            {product.imagens.length > 1 && (
                <div className="thumbnail-images">
                {product.imagens.map((img, index) => (
                    <div 
                        key={index} 
                        className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                        onClick={() => setActiveImage(index)}
                    >
                    <img src={img} alt={`${product.nome} - imagem ${index + 1}`} />
                    </div>
                ))}
                </div>
            )}
          </div>

          <div className="product-info">
            <h1>{product.nome}</h1>
            <div className="product-meta">
              <span className="product-brand">Marca: {product.marca}</span>
              <span className="product-category">Categoria: {product.categoria}</span>
            </div>
            <div className="product-price">R$ {product.preco.toFixed(2)}</div>
            <div className="product-description">
              <h3>Descrição</h3>
              <p>{product.descricao}</p>
            </div>
            <div className="product-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" max={product.estoque}/>
                <button onClick={() => setQuantity(Math.min(product.estoque, quantity + 1))} disabled={quantity >= product.estoque}>+</button>
              </div>
              {/* === ADICIONADO ESTILO INLINE AQUI PARA TESTE === */}
              <button
                className="btn btn-primary add-to-cart"
                onClick={handleAddToCart}
                disabled={product.estoque === 0}
                style={{
                  padding: '10px 15px', // Reduza este valor se ainda estiver grande
                  fontSize: '0.9rem',
                  maxWidth: '200px', // Reduza este valor se ainda estiver grande
                  backgroundColor: 'green', // Apenas para um feedback visual claro
                  color: 'white'
                }}
              >
                <FaShoppingCart /> Adicionar ao Carrinho
              </button>
            </div>
            <div className="stock-info">
              {product.estoque > 0 ? (
                <span className="in-stock">Em estoque: {product.estoque} unidades</span>
              ) : (
                <span className="out-of-stock">Produto indisponível</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;