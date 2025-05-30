import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import './ProductsPage.css'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Mude aqui: use API_BASE_URL
        const response = await axios.get(`${API_BASE_URL}/produtos`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao carregar produtos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Array de dependências vazio, a busca é feita apenas uma vez ao montar o componente

  return (
    <div className="products-page">
      <div className="container">
        <h1>Todos os Produtos</h1>
        
        <div className="category-navigation">
          <Link to="/produtos/joias" className="category-link">
            <div className="category-card">
              <img src="https://via.placeholder.com/300" alt="Joias" />
              <h3>Joias</h3>
            </div>
          </Link>
          <Link to="/produtos/relogios" className="category-link">
            <div className="category-card">
              <img src="https://via.placeholder.com/300" alt="Relógios" />
              <h3>Relógios</h3>
            </div>
          </Link>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        {loading ? (
          <p>Carregando produtos...</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;