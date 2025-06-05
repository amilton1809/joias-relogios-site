import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './CategoryPage.css'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const CategoryPage = () => {
  const { categoria } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        
        const response = await axios.get(`${API_BASE_URL}/produtos`);
        
        // Filtrar por categoria se especificada
        const filteredByCategory = categoria 
          ? response.data.filter(p => p.categoria === categoria)
          : response.data;
        
        setProducts(filteredByCategory);
        setFilteredProducts(filteredByCategory);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao carregar produtos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoria]); // categoria é uma dependência importante aqui

  useEffect(() => {
    // Aplicar filtros e ordenação
    let result = [...products];
    
    // Aplicar filtro de busca
    if (searchTerm) {
      result = result.filter(
        product => 
          product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.marca.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar filtro de preço
    result = result.filter(
      product => 
        product.preco >= priceRange.min && 
        product.preco <= priceRange.max
    );
    
    // Aplicar ordenação
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.preco - b.preco);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.preco - a.preco);
    } else if (sortOption === 'name-asc') {
      result.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (sortOption === 'name-desc') {
      result.sort((a, b) => b.nome.localeCompare(a.nome));
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, sortOption, priceRange]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value) || 0;
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const getCategoryTitle = () => {
    if (!categoria) return 'Todos os Produtos';
    // Capitalize a primeira letra
    return categoria.charAt(0).toUpperCase() + categoria.slice(1);
  };

  return (
    <div className="category-page">
      <div className="container">
        <div className="category-header">
          <h1>{getCategoryTitle()}</h1>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button><FaSearch /></button>
          </div>
          
          <button className="filter-toggle" onClick={toggleFilters}>
            <FaFilter /> Filtros
          </button>
        </div>
        
        <div className={`filters-section ${showFilters ? 'show' : ''}`}>
          <div className="filter-group">
            <h3>Ordenar por</h3>
            <select value={sortOption} onChange={handleSortChange}>
              <option value="">Relevância</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
            </select>
          </div>
          
          <div className="filter-group">
            <h3>Faixa de Preço</h3>
            <div className="price-inputs">
              <div>
                <label>Min:</label>
                <input 
                  type="number" 
                  value={priceRange.min} 
                  onChange={(e) => handlePriceChange(e, 'min')}
                  min="0"
                />
              </div>
              <div>
                <label>Max:</label>
                <input 
                  type="number" 
                  value={priceRange.max} 
                  onChange={(e) => handlePriceChange(e, 'max')}
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="filter-group">
            <h3>Categorias</h3>
            <ul className="category-links">
              <li>
                <Link to="/produtos" className={!categoria ? 'active' : ''}>
                  Todos os Produtos
                </Link>
              </li>
              <li>
                <Link to="/produtos/joias" className={categoria === 'joias' ? 'active' : ''}>
                  Joias
                </Link>
              </li>
              <li>
                <Link to="/produtos/relogios" className={categoria === 'relogios' ? 'active' : ''}>
                  Relógios
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        {loading ? (
          <p>Carregando produtos...</p>
        ) : (
          <div className="products-section">
            <div className="results-info">
              <p>Exibindo {filteredProducts.length} produtos</p>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>Nenhum produto encontrado com os filtros selecionados.</p>
                <button onClick={() => {
                  setSearchTerm('');
                  setPriceRange({ min: 0, max: 10000 });
                  setSortOption('');
                }}>
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;