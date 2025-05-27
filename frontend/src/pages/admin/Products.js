import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './products.css'

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

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

  const deleteProduct = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await axios.delete(`http://localhost:5000/api/produtos/${id}`);
        setProducts(products.filter(product => product._id !== id));
      } catch (error) {
        setError('Erro ao excluir produto');
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
              {products.map(product => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
