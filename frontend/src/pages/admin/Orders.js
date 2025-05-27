import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaCheck, FaTruck } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/pedidos');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError('Erro ao carregar pedidos');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/pedidos/${id}/${status}`);
      
      // Atualizar a lista de pedidos após a mudança de status
      setOrders(orders.map(order => 
        order._id === id ? { ...order, [status === 'pagar' ? 'isPago' : 'isEntregue']: true } : order
      ));
    } catch (error) {
      setError('Erro ao atualizar status do pedido');
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
                    <td>{order._id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.usuario?.nome || 'Usuário'}</td>
                    <td>R$ {order.valorTotal.toFixed(2)}</td>
                    <td>
                      {order.isPago ? (
                        <span className="badge bg-success">Sim</span>
                      ) : (
                        <span className="badge bg-danger">Não</span>
                      )}
                    </td>
                    <td>
                      {order.isEntregue ? (
                        <span className="badge bg-success">Sim</span>
                      ) : (
                        <span className="badge bg-danger">Não</span>
                      )}
                    </td>
                    <td>
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
