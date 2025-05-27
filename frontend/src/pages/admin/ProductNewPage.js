// frontend/src/pages/admin/ProductNewPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Ajuste o caminho se necessário
import './productnewpage.css'; // <--- IMPORTE O CSS AQUI

const ProductNewPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Descomentando para uso do token

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'joias', // ou 'relogios'
    preco: '',
    estoque: '',
    marca: '',
    imagens: [''], // Array para múltiplas imagens
    emDestaque: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.imagens];
    newImages[index] = value;
    setFormData({ ...formData, imagens: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, imagens: [...formData.imagens, ''] });
  };

  // Função para remover um campo de imagem
  const removeImageField = (index) => {
    const newImages = formData.imagens.filter((_, i) => i !== index);
    setFormData({ ...formData, imagens: newImages });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remover campos de imagem vazios antes de enviar
      const dataToSend = {
        ...formData,
        imagens: formData.imagens.filter(img => img.trim() !== '')
      };
      
      // Supondo que você precisa enviar um token de autenticação
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`, // <--- USE O TOKEN AQUI
        },
      };

      const response = await axios.post('http://localhost:5000/api/produtos', dataToSend, config);
      alert('Produto criado com sucesso!');
      navigate(`/admin/products`); // Redireciona para a lista de produtos admin
    } catch (error) {
      console.error('Erro ao criar produto:', error.response ? error.response.data.message : error.message);
      alert('Erro ao criar produto: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="product-new-container"> {/* <--- CLASSE PRINCIPAL */}
      <h1>Adicionar Novo Produto</h1>
      <form onSubmit={handleSubmit} className="product-new-form"> {/* <--- CLASSE DO FORMULÁRIO */}
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="preco">Preço:</label>
          <input type="number" id="preco" name="preco" value={formData.preco} onChange={handleChange} required step="0.01" />
        </div>
        <div className="form-group">
          <label htmlFor="estoque">Estoque:</label>
          <input type="number" id="estoque" name="estoque" value={formData.estoque} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="marca">Marca:</label>
          <input type="text" id="marca" name="marca" value={formData.marca} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="categoria">Categoria:</label>
          <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required>
            <option value="joias">Joias</option>
            <option value="relogios">Relógios</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Imagens (URLs):</label>
          {formData.imagens.map((img, index) => (
            <div key={index} className="image-input-row"> {/* <--- CLASSE PARA ALINHAR IMAGENS */}
              <input 
                type="text" 
                value={img} 
                onChange={(e) => handleImageChange(index, e.target.value)} 
                placeholder={`URL da Imagem ${index + 1}`} 
              />
              {/* Botão de remover imagem, só aparece se tiver mais de uma */}
              {formData.imagens.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeImageField(index)}
                  className="btn btn-danger"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addImageField} className="btn">Adicionar outra imagem</button>
        </div>

        <div className="form-group checkbox-group"> {/* <--- CLASSE PARA CHECKBOX */}
          <label>
            <input 
              type="checkbox" 
              name="emDestaque" 
              checked={formData.emDestaque} 
              onChange={handleChange} 
            />
            Produto em Destaque
          </label>
        </div>

        <button type="submit" className="btn btn-primary">Criar Produto</button>
      </form>
    </div>
  );
};

export default ProductNewPage;