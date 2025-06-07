// frontend/src/pages/admin/ProductForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaSave, FaArrowLeft, FaTrash } from 'react-icons/fa'; // Adicionado FaTrash para remover imagens

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Este componente pode ser usado tanto para criar quanto para editar produtos
const ProductForm = ({ isEditMode }) => {
  const { id } = useParams(); // 'id' só existe se for modo de edição
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoria: 'joias',
    preco: 0,
    estoque: 0,
    marca: '',
    emDestaque: false
  });
  const [currentImageUrls, setCurrentImageUrls] = useState([]); // Armazena URLs de imagens já salvas
  const [selectedFiles, setSelectedFiles] = useState([]); // Armazena os objetos File para novos uploads
  const [loading, setLoading] = useState(isEditMode); // Se for edição, começa carregando
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Lógica para carregar os dados do produto se for em modo de edição
  useEffect(() => {
    const fetchProduct = async () => {
      if (!currentUser || !currentUser.token) {
        setError('Você não está autorizado. Faça login como administrador.');
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        const response = await axios.get(`${API_BASE_URL}/produtos/${id}`, config);
        setFormData({
          nome: response.data.nome,
          descricao: response.data.descricao,
          categoria: response.data.categoria,
          preco: response.data.preco,
          estoque: response.data.estoque,
          marca: response.data.marca,
          emDestaque: response.data.emDestaque
        });
        setCurrentImageUrls(response.data.imagens || []); // Preenche com as URLs existentes
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar produto');
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchProduct();
    } else {
      setLoading(false); // Não precisa carregar se for novo produto
    }
  }, [id, isEditMode, currentUser]); // Adicione currentUser como dependência para re-executar se o usuário mudar

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // Lida com a seleção de arquivos do input type="file"
  const handleFileChange = (e) => {
    // Converte FileList para Array, permite múltiplas seleções
    setSelectedFiles(Array.from(e.target.files));
  };

  // Remove uma imagem existente (salva no banco de dados)
  const handleRemoveExistingImage = (urlToRemove) => {
    // Filtra a URL da imagem a ser removida do array de imagens atuais
    setCurrentImageUrls(currentImageUrls.filter(url => url !== urlToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!currentUser || !currentUser.token) {
      setError('Você não está autorizado a salvar produtos. Faça login como administrador.');
      setSubmitting(false);
      return;
    }

    try {
      if (!formData.nome || !formData.descricao || !formData.marca || formData.preco <= 0) {
        setError('Preencha todos os campos obrigatórios');
        setSubmitting(false);
        return;
      }

      const dataToSend = new FormData();
      dataToSend.append('nome', formData.nome);
      dataToSend.append('descricao', formData.descricao);
      dataToSend.append('categoria', formData.categoria);
      dataToSend.append('preco', formData.preco);
      dataToSend.append('estoque', formData.estoque);
      dataToSend.append('marca', formData.marca);
      dataToSend.append('emDestaque', formData.emDestaque);

      // Anexar os novos arquivos de imagem para upload
      selectedFiles.forEach(file => {
        dataToSend.append('imagens', file); // 'imagens' é o nome do campo esperado pelo Multer no backend
      });

      // Se estiver editando, envie as URLs das imagens existentes que NÃO foram removidas
      // O backend precisará ser ajustado para mesclar as URLs existentes com as novas imagens.
      // Por simplicidade, o backend que fornecemos anteriormente substituiria TUDO se houvesse novos uploads.
      // Se você quer manter as antigas e adicionar novas, o backend precisaria de lógica extra.
      // Para este frontend, estamos enviando as URLs remanescentes (as que não foram clicadas para remover).
      currentImageUrls.forEach(url => {
        dataToSend.append('existingImages', url); // Exemplo de como enviar URLs existentes que devem ser mantidas
      });


      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          // 'Content-Type': 'multipart/form-data' é automaticamente definido pelo Axios quando você envia FormData
        },
      };

      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/produtos/${id}`, dataToSend, config);
      } else {
        await axios.post(`${API_BASE_URL}/produtos`, dataToSend, config);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar produto');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Carregando produto...</p>;
  }

  return (
    <div className="product-edit">
      <div className="admin-header">
        <h1>{isEditMode ? 'Editar Produto' : 'Novo Produto'}</h1>
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

        {/* Seção para imagens existentes (apenas em modo de edição) */}
        {isEditMode && currentImageUrls.length > 0 && (
          <div className="form-group">
            <label>Imagens Atuais</label>
            <div className="existing-images-preview">
              {currentImageUrls.map((imgUrl, index) => (
                <div key={index} className="image-preview-item">
                  <img src={`${API_BASE_URL}${imgUrl}`} alt={`Imagem ${index}`} className="product-thumbnail" /> {/* Usa API_BASE_URL */}
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(imgUrl)}
                    className="btn btn-danger btn-sm"
                  >
                    <FaTrash /> Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seção para upload de novas imagens */}
        <div className="form-group">
          <label>Upload de Novas Imagens</label>
          <input
            type="file"
            multiple // Permite selecionar múltiplos arquivos
            onChange={handleFileChange}
            accept="image/*" // Sugere que apenas arquivos de imagem sejam selecionados
          />
          <div className="new-images-preview">
            {selectedFiles.map((file, index) => (
              <img key={index} src={URL.createObjectURL(file)} alt={`Nova Imagem ${index}`} className="product-thumbnail" />
            ))}
          </div>
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

export default ProductForm;