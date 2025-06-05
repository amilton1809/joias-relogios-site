import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './ProductEdit.css'; //

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Precisaremos do token para autenticação
  const isEdit = id !== 'new'; // 'new' indica que é um novo produto, não edição

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'joias',
    preco: 0,
    estoque: 0,
    marca: '',
    imagens: [''],
    emDestaque: false
  });
  
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      // Verificação de autenticação e token antes da requisição
      if (!currentUser || !currentUser.token) {
        setError('Você não está autorizado a editar produtos. Faça login como administrador.');
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        };
        // Use API_BASE_URL para a requisição GET
        const response = await axios.get(`${API_BASE_URL}/produtos/${id}`, config);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao carregar produto');
        setLoading(false);
      }
    };

    if (isEdit) { // Apenas busca se for um produto existente (edição)
      fetchProduct();
    } else { // Se for um novo produto, não precisa buscar, apenas inicializar o formulário
        setLoading(false);
    }
  }, [id, isEdit, currentUser]); // Adicione currentUser como dependência

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e, index) => {
    const newImages = [...formData.imagens];
    newImages[index] = e.target.value;
    setFormData({
      ...formData,
      imagens: newImages
    });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      imagens: [...formData.imagens, '']
    });
  };

  const removeImageField = (index) => {
    const newImages = [...formData.imagens];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      imagens: newImages
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Verificação de autenticação e token antes da requisição POST/PUT
    if (!currentUser || !currentUser.token) {
      setError('Você não está autorizado a salvar produtos. Faça login como administrador.');
      setSubmitting(false);
      return;
    }

    try {
      // Validar campos obrigatórios
      if (!formData.nome || !formData.descricao || !formData.marca || formData.preco <= 0) {
        setError('Preencha todos os campos obrigatórios');
        setSubmitting(false);
        return;
      }

      // Remover URLs de imagem vazias
      const cleanedFormData = {
        ...formData,
        imagens: formData.imagens.filter(img => img.trim() !== '')
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`, // Token para autenticação
        },
      };

      if (isEdit) {
        // Use API_BASE_URL para a requisição PUT
        await axios.put(`${API_BASE_URL}/produtos/${id}`, cleanedFormData, config);
      } else {
        // Use API_BASE_URL para a requisição POST (criação de produto)
        await axios.post(`${API_BASE_URL}/produtos`, cleanedFormData, config);
      }

      navigate('/admin/products'); // Redireciona para a lista de produtos após salvar
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar produto');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Carregando produto...</p>;
  }

  return (
    <div className="product-edit">
      <div className="admin-header">
        <h1>{isEdit ? 'Editar Produto' : 'Novo Produto'}</h1>
        <button 
          onClick={() => navigate('/admin/products')} 
          className="btn btn-secondary"
        >
          <FaArrowLeft /> Voltar
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="nome">Nome do Produto*</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição*</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="categoria">Categoria*</label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              <option value="joias">Joias</option>
              <option value="relogios">Relógios</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="marca">Marca*</label>
            <input
              type="text"
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="preco">Preço (R$)*</label>
            <input
              type="number"
              id="preco"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="estoque">Estoque*</label>
            <input
              type="number"
              id="estoque"
              name="estoque"
              value={formData.estoque}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Imagens do Produto</label>
          {formData.imagens.map((img, index) => (
            <div key={index} className="image-input-row">
              <input
                type="text"
                value={img}
                onChange={(e) => handleImageChange(e, index)}
                placeholder="URL da imagem"
              />
              <button 
                type="button" 
                onClick={() => removeImageField(index)}
                className="btn btn-danger btn-sm"
                disabled={formData.imagens.length <= 1}
              >
                Remover
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={addImageField}
            className="btn btn-secondary btn-sm"
          >
            Adicionar Imagem
          </button>
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="emDestaque"
            name="emDestaque"
            checked={formData.emDestaque}
            onChange={handleChange}
          />
          <label htmlFor="emDestaque">Produto em Destaque</label>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            <FaSave /> {submitting ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;