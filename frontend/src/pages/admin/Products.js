import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './products.css'

const Products = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth(); // Descomentando para usar o token

  useEffect(() => {
    const fetchProducts = async () => {
      // Verifique se o usuário está logado e tem um token antes de fazer a requisição
      // As rotas de listagem de produtos (/api/produtos) são públicas no seu backend
      // Mas para o painel de admin, é bom ter certeza que é um admin.
      if (!currentUser || !currentUser.token || !currentUser.isAdmin) {
        setError('Você não está autorizado a ver esta página. Faça login como administrador.');
        setLoading(false);
        return;
      }

      try {
        // Configuração com o token de autenticação
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        };
        // Mude aqui: use API_BASE_URL
        const response = await axios.get(`${API_BASE_URL}/produtos`, config);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao carregar produtos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentUser]); // Adiciona currentUser como dependência para re-executar se o usuário mudar

  const deleteProduct = async (id) => {
    // Verifique se o usuário está logado e tem um token antes de fazer a requisição
    if (!currentUser || !currentUser.token || !currentUser.isAdmin) {
      alert('Você não está autorizado a excluir produtos.');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        // Configuração com o token de autenticação
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        };
        // Mude aqui: use API_BASE_URL
        await axios.delete(`${API_BASE_URL}/produtos/${id}`, config);
        setProducts(products.filter(product => product._id !== id));
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao excluir produto');
      }
    }
  };

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Gerenciamento de Produtos</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          <FaPlus /> Adicionar Produto
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">Nenhum produto encontrado</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>
                      <img 
                        src={product.imagens[0] || 'https://via.placeholder.com/50'} 
                        alt={product.nome} 
                        className="product-thumbnail" 
                      />
                    </td>
                    <td>{product.nome}</td>
                    <td>{product.categoria}</td>
                    <td>R$ {product.preco.toFixed(2)}</td>
                    <td>{product.estoque}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/products/edit/${product._id}`} className="btn btn-sm btn-info">
                          <FaEdit />
                        </Link>
                        <button 
                          onClick={() => deleteProduct(product._id)} 
                          className="btn btn-sm btn-danger"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;