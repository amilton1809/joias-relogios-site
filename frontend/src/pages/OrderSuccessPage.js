import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaList } from 'react-icons/fa';

const OrderSuccessPage = ({ match }) => {
  const orderId = match?.params?.id || 'unknown';

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-container">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          
          <h1>Pedido Realizado com Sucesso!</h1>
          
          <p className="order-id">Número do pedido: <strong>{orderId}</strong></p>
          
          <p className="success-message">
            Obrigado pela sua compra! Seu pedido foi recebido e está sendo processado.
            Você receberá um e-mail de confirmação com os detalhes do seu pedido em breve.
          </p>
          
          <div className="success-actions">
            <Link to="/" className="btn btn-primary">
              <FaHome /> Voltar para a Página Inicial
            </Link>
            
            <Link to="/profile/orders" className="btn btn-secondary">
              <FaList /> Ver Meus Pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
