import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShoppingCart, FaStar } from 'react-icons/fa';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Aqui seria feita a chamada à API para buscar detalhes do produto
    // Simulação para demonstração
    const demoProduct = {
      _id: id,
      nome: 'Relógio Elegance Gold',
      descricao: 'Relógio de luxo com acabamento em ouro 18k, mostrador em madrepérola e pulseira de couro genuíno. Este relógio combina elegância clássica com tecnologia moderna, sendo resistente à água e com bateria de longa duração.',
      categoria: 'relogios',
      preco: 1299.99,
      estoque: 10,
      imagens: [
        'https://via.placeholder.com/600',
        'https://via.placeholder.com/600',
        'https://via.placeholder.com/600'
      ],
      marca: 'Elegance',
      emDestaque: true
    };
    
    setProduct(demoProduct);
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    // Aqui seria implementada a lógica para adicionar ao carrinho
    console.log('Adicionando ao carrinho:', { product, quantity });
  };

  if (loading) {
    return (
      <div className="container">
        <p>Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <p>Produto não encontrado</p>
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
