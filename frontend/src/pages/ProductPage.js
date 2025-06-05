import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import axios from 'axios';  

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Adicionado estado para erros
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(''); // Limpa erros anteriores
        // A requisição real à API para obter o produto pelo ID
        const response = await axios.get(`${API_BASE_URL}/produtos/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        // Captura o erro e define a mensagem
        setError(err.response?.data?.message || 'Erro ao carregar o produto. Tente novamente mais tarde.');
        console.error('Erro ao buscar produto:', err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // A dependência 'id' garante que a busca seja re-executada se o ID mudar

  const handleAddToCart = () => {
    // Lógica para adicionar ao carrinho (será implementada com contexto/estado global)
    if (product && quantity > 0) {
      console.log('Adicionando ao carrinho:', { product, quantity });
      
    } else {
      console.warn('Não foi possível adicionar ao carrinho: produto ou quantidade inválida.');
    }
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

  // Exibe mensagem de erro se houver
  if (error) {
    return (
      <div className="product-page">
        <div className="container">
          <p className="error-message">{error}</p> {}
        </div>
      </div>
    );
  }

  // Se o produto não foi encontrado (e não houve erro de rede, etc.), exibe a mensagem de não encontrado
  if (!product) {
    return (
      <div className="product-page">
        <div className="container">
          <p>Produto não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="container">
        <div className="product-details">
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.imagens[0]} alt={product.nome} />
            </div>
            <div className="thumbnail-images">
              {product.imagens.map((img, index) => (
                <div key={index} className="thumbnail">
                  <img src={img} alt={`${product.nome} - imagem ${index + 1}`} />
                </div>
              ))}
            </div>
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
      </div>
    </div>
  );
};

export default ProductPage;