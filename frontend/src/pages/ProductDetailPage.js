import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Mantido caso precise do currentUser para outras lógicas, mas não para a requisição GET

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Não utilizado na requisição GET, mas pode ser usado para outras coisas

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Mude aqui: use API_BASE_URL
        const response = await axios.get(`${API_BASE_URL}/produtos/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao carregar detalhes do produto');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Dependência 'id' para recarregar se o ID do produto na URL mudar

  const handleAddToCart = () => {
    // Implementação do carrinho de compras (esta lógica não faz requisição de API)
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Verificar se o produto já está no carrinho
    const existingItem = cartItems.find(item => item._id === product._id);
    
    if (existingItem) {
      // Atualizar quantidade
      const updatedItems = cartItems.map(item => 
        item._id === product._id 
          ? { ...item, quantidade: item.quantidade + quantity } 
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    } else {
      // Adicionar novo item
      const newItem = {
        _id: product._id,
        nome: product.nome,
        preco: product.preco,
        imagem: product.imagens[0],
        quantidade: quantity
      };
      localStorage.setItem('cartItems', JSON.stringify([...cartItems, newItem]));
    }
    
    // Redirecionar para o carrinho
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="container">
        <p>Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <p>{error || 'Produto não encontrado'}</p>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          <FaArrowLeft /> Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; 
          <Link to={`/produtos/${product.categoria}`}>
            {product.categoria === 'joias' ? 'Joias' : 'Relógios'}
          </Link> &gt; 
          <span>{product.nome}</span>
        </div>
        
        <div className="product-detail">
          <div className="product-gallery">
            <div className="main-image">
              <img 
                src={product.imagens[activeImage] || 'https://via.placeholder.com/600'} 
                alt={product.nome} 
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
              <span className="product-category">
                Categoria: {product.categoria === 'joias' ? 'Joias' : 'Relógios'}
              </span>
            </div>
            
            <div className="product-price">R$ {product.preco.toFixed(2)}</div>
            
            <div className="product-description">
              <h3>Descrição</h3>
              <p>{product.descricao}</p>
            </div>
            
            <div className="product-actions">
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.estoque}
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.estoque, quantity + 1))}
                  disabled={quantity >= product.estoque}
                >
                  +
                </button>
              </div>
              
              <button 
                className="btn btn-primary add-to-cart"
                onClick={handleAddToCart}
                disabled={product.estoque === 0}
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
        
        <div className="related-products">
          <h2>Produtos Relacionados</h2>
          {/* Se esta seção buscar produtos relacionados da API, a chamada também precisaria usar API_BASE_URL */}
          <p>Carregando produtos relacionados...</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;