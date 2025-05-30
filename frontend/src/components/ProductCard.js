import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import './ProductCard.css'

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.imagens && product.imagens.length > 0 
            ? product.imagens[0] 
            : 'https://via.placeholder.com/300'} 
          alt={product.nome} 
        />
        {product.emDestaque && <span className="featured-badge">Destaque</span>}
      </div>
      
      <div className="product-info">
        <h3>{product.nome}</h3>
        <div className="product-category">
          {product.categoria === 'joias' ? 'Joias' : 'Relógios'} | {product.marca}
        </div>
        <div className="product-price">R$ {product.preco.toFixed(2)}</div>
        
        <div className="product-actions">
          <Link to={`/product/${product._id}`} className="btn btn-outline">
            <FaEye /> Ver Detalhes
          </Link>
          <Link to={`/product/${product._id}`} className="btn btn-primary">
            <FaShoppingCart /> Comprar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
