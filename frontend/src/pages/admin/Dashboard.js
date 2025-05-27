import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaShoppingBag, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    productCount: 0,
    orderCount: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    // Aqui seria feita a chamada à API para buscar estatísticas
    // Simulação para demonstração
    const fetchStats = async () => {
      try {
        // Em um ambiente real, estas seriam chamadas à API
        setStats({
          userCount: 25,
          productCount: 48,
          orderCount: 124,
          totalSales: 45.99
        });
        setLoading(false);
      } catch (error) {
        setError('Erro ao carregar estatísticas');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Painel Administrativo</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <p>Carregando estatísticas...</p>
      ) : (
        <>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>Usuários</h3>
                <p className="stat-number">{stats.userCount}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FaShoppingBag />
              </div>
              <div className="stat-content">
                <h3>Produtos</h3>
                <p className="stat-number">{stats.productCount}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h3>Pedidos</h3>
                <p className="stat-number">{stats.orderCount}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <FaMoneyBillWave />
              </div>
              <div className="stat-content">
                <h3>Vendas</h3>
                <p className="stat-number">R$ {stats.totalSales.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="admin-actions">
            <div className="action-card">
              <h3>Gerenciamento de Produtos</h3>
              <p>Adicione, edite ou remova produtos da loja.</p>
              <Link to="/admin/products" className="btn btn-primary">
                Gerenciar Produtos
              </Link>
            </div>
            
            <div className="action-card">
              <h3>Gerenciamento de Pedidos</h3>
              <p>Visualize e gerencie os pedidos dos clientes.</p>
              <Link to="/admin/orders" className="btn btn-primary">
                Gerenciar Pedidos
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
