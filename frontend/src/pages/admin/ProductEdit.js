import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEdit = id !== 'new';

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
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/produtos/${id}`);
          setFormData(response.data);
          setLoading(false);
        } catch (error) {
          setError('Erro ao carregar produto');
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEdit]);

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

      if (isEdit) {
        await axios.put(`http://localhost:5000/api/produtos/${id}`, cleanedFormData);
      } else {
        await axios.post('http://localhost:5000/api/produtos', cleanedFormData);
      }

      navigate('/admin/products');
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
