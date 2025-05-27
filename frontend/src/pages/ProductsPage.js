import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/produtos');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError('Erro ao carregar produtos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
