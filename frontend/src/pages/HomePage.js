import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { FaSearch } from 'react-icons/fa';
import './HomePage.css'
import pulseiraImg from '../img/pulseira.webp'; //Importando imagem

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Produtos de exemplo para demonstração
  useEffect(() => {
    // Aqui seria feita a chamada à API para buscar produtos em destaque
    const demoProducts = [
      {
        _id: '1',
        nome: 'Relógio Elegance Gold',
        descricao: 'Relógio de luxo com acabamento em ouro',
        categoria: 'relogios',
        preco: 1299.99,
        estoque: 10,
        imagens: ['https://lojavivara.vtexassets.com/arquivos/ids/908225-1600-1600/Relogio-Vivara-Biomas-Tapete-Verde-Masculino-Aco-65461_1_set.jpg?v=638724870842030000'],
        marca: 'Elegance',
        emDestaque: true
      },
      {
        _id: '2',
        nome: 'Colar de Diamantes',
        descricao: 'Colar com diamantes autênticos',
        categoria: 'joias',
        preco: 2499.99,
        estoque: 5,
        imagens: ['https://lojavivara.vtexassets.com/arquivos/ids/908225-1600-1600/Relogio-Vivara-Biomas-Tapete-Verde-Masculino-Aco-65461_1_set.jpg?v=638724870842030000'],
        marca: 'Diamond Collection',
        emDestaque: true
      },
      {
        _id: '3',
        nome: 'Pulseira de Prata',
        descricao: 'Pulseira de prata 925',
        categoria: 'joias',
        preco: 399.99,
        estoque: 15,
        imagens: ['https://lojavivara.vtexassets.com/arquivos/ids/908225-1600-1600/Relogio-Vivara-Biomas-Tapete-Verde-Masculino-Aco-65461_1_set.jpg?v=638724870842030000'],
        marca: 'Silver Dreams',
        emDestaque: true
      },
      {
        _id: '4',
        nome: 'Relógio Esportivo',
        descricao: 'Relógio resistente à água para esportes',
        categoria: 'relogios',
        preco: 899.99,
        estoque: 8,
        imagens: ['https://lojavivara.vtexassets.com/arquivos/ids/908225-1600-1600/Relogio-Vivara-Biomas-Tapete-Verde-Masculino-Aco-65461_1_set.jpg?v=638724870842030000'],
        marca: 'SportTime',
        emDestaque: true
      }
    ];
    
    setFeaturedProducts(demoProducts);
    setLoading(false);
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Joias & Relógios de Luxo</h1>
            <p>Descubra nossa coleção exclusiva de joias e relógios de alta qualidade</p>
            <div className="search-bar">
              <input type="text" placeholder="Buscar produtos..." />
              <button><FaSearch /></button>
            </div>
            <div className="hero-buttons">
              <a href="/produtos/joias" className="btn btn-primary">Ver Joias</a>
              <a href="/produtos/relogios" className="btn btn-secondary">Ver Relógios</a>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Produtos em Destaque</h2>
          {loading ? (
            <p>Carregando produtos...</p>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <h2>Categorias</h2>
          <div className="categories-grid">
            <div className="category-card">
              <img src={pulseiraImg} alt="Joias" />
              <h3>Joias</h3>
              <a href="/produtos/joias" className="btn btn-outline">Ver Coleção</a>
            </div>
            <div className="category-card">
              <img src="../img/pulseira1.webp" alt="Relógios" />
              <h3>Relógios</h3>
              <a href="/produtos/relogios" className="btn btn-outline">Ver Coleção</a>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <h2>Sobre Nós</h2>
            <p>
              Somos uma loja especializada em joias e relógios de luxo, oferecendo produtos de alta qualidade 
              e design exclusivo. Nossa missão é proporcionar elegância e sofisticação para nossos clientes, 
              com peças que combinam tradição e modernidade.
            </p>
            <a href="/sobre" className="btn btn-secondary">Saiba Mais</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
