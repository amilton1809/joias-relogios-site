import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { FaSearch } from 'react-icons/fa';
import './HomePage.css'

// Adicione esta linha para importar o axios, caso ainda não esteja fazendo em alguma parte do código
// import axios from 'axios'; 

// Defina a API_BASE_URL usando process.env, assim como nos seus outros arquivos
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // CORREÇÃO AQUI: Use API_BASE_URL para a requisição
        const response = await fetch(`${API_BASE_URL}/produtos/destaque`); //

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); //
        }
        const data = await response.json(); //
        setFeaturedProducts(data); //
      } catch (err) {
        console.error("Erro ao buscar produtos em destaque:", err); //
        setError("Não foi possível carregar os produtos em destaque. Tente novamente mais tarde."); //
      } finally {
        setLoading(false); //
      }
    };

    fetchFeaturedProducts();
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
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : featuredProducts.length === 0 ? (
            <p>Nenhum produto em destaque encontrado.</p>
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
              <img src="../img/pulseira12.webp" alt="Joias" />
              <h3>Joias</h3>
              <a href="/produtos/joias" className="btn btn-outline">Ver Coleção</a>
            </div>
            <div className="category-card">
              <img src="../img/relogio.webp" alt="Relógios" />
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