import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaCheck, FaTruck } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Orders.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth(); // Descomentando para usar o token

  useEffect(() => {
    const fetchOrders = async () => {
      // Verifique se o usuário está logado e tem um token antes de fazer a requisição
      if (!currentUser || !currentUser.token) {
        setError('Você precisa estar logado para ver os pedidos.');
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
        const response = await axios.get(`${API_BASE_URL}/pedidos`, config);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao carregar pedidos');
        setLoading(false);
      }
    };

    fetchOrders(); // Chama a função ao montar o componente
  }, [currentUser]);

  const updateOrderStatus = async (id, status) => {
    // Verifique se o usuário está logado e tem um token antes de fazer a requisição
    if (!currentUser || !currentUser.token) {
      setError('Você precisa estar logado para atualizar pedidos.');
      return;
    }

    try {
      // Configuração com o token de autenticação
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      };


      await axios.put(`${API_BASE_URL}/pedidos/${id}/${status}`, {}, config); // O segundo parâmetro {} é o body, mesmo que vazio

      // Atualizar a lista de pedidos após a mudança de status
      setOrders(orders.map(order =>
        order._id === id
          ? { ...order, [status === 'pagar' ? 'isPago' : 'isEntregue']: true }
          : order
      ));
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao atualizar status do pedido');
    }
  };

  return (
    <div className="admin-orders">
      <h1>Gerenciamento de Pedidos</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Entregue</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">Nenhum pedido encontrado</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id}>
                    <td data-label="ID">{order._id}</td> {/* Adicione data-label */}
                    <td data-label="Data">{new Date(order.createdAt).toLocaleDateString()}</td> {/* Adicione data-label */}
                    <td data-label="Cliente">{order.usuario?.nome || 'Usuário'}</td> {/* Adicione data-label */}
                    <td data-label="Total">R$ {order.valorTotal.toFixed(2)}</td> {/* Adicione data-label */}
                    <td data-label="Pago"> {/* Adicione data-label */}
                      {order.isPago ? (
                        <span className="badge bg-success">Sim</span>
                      ) : (
                        <span className="badge bg-danger">Não</span>
                      )}
                    </td>
                    <td data-label="Entregue"> {/* Adicione data-label */}
                      {order.isEntregue ? (
                        <span className="badge bg-success">Sim</span>
                      ) : (
                        <span className="badge bg-danger">Não</span>
                      )}
                    </td>
                    <td data-label="Ações"> {/* Adicione data-label */}
                      <div className="action-buttons">
                        <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-info">
                          <FaEye />
                        </Link>
                        {!order.isPago && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'pagar')}
                            className="btn btn-sm btn-success"
                          >
                            <FaCheck /> Marcar Pago
                          </button>
                        )}
                        {order.isPago && !order.isEntregue && (
                          <button
                            onClick={() => updateOrderStatus(order._id, 'entregar')}
                            className="btn btn-sm btn-primary"
                          >
                            <FaTruck /> Marcar Entregue
                          </button>
                        )}
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

export default Orders;