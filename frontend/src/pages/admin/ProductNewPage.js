// ProductNewPage.js (aplicar similarmente em ProductEdit.js)
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FaSave, FaArrowLeft } from 'react-icons/fa'; // Para ProductEdit.js
import './ProductNewPage.css'; // ou ProductEdit.css

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const ProductPage = ({ isEditMode }) => { // Pode ser um componente reutilizável ou separado
  const { id } = useParams(); // Apenas para ProductEdit
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
  const [currentImageUrls, setCurrentImageUrls] = useState([]); // Para imagens existentes (apenas em edição)
  const [selectedFiles, setSelectedFiles] = useState([]); // Para os novos arquivos a serem uploaded
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Lógica para carregar o produto em modo de edição
  useEffect(() => {
    const fetchProduct = async () => {
      if (!currentUser || !currentUser.token) {
        setError('Você não está autorizado. Faça login como administrador.');
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        const response = await axios.get(`<span class="math-inline">\{API\_BASE\_URL\}/produtos/</span>{id}`, config);
        setFormData({
          nome: response.data.nome,
          descricao: response.data.descricao,
          categoria: response.data.categoria,
          preco: response.data.preco,
          estoque: response.data.estoque,
          marca: response.data.marca,
          emDestaque: response.data.emDestaque
        });
        setCurrentImageUrls(response.data.imagens || []); // Guarda as URLs existentes
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar produto');
        setLoading(false);
      }
    };
    if (isEditMode) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id, isEditMode, currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files)); // Converte FileList para Array
  };

  const handleRemoveExistingImage = (urlToRemove) => {
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

      // Anexar os novos arquivos de imagem
      selectedFiles.forEach(file => {
        dataToSend.append('imagens', file); // 'imagens' é o nome do campo esperado pelo Multer no backend
      });

      // Se estiver editando, você pode enviar as URLs das imagens existentes que não foram removidas
      // Isso requer uma lógica mais sofisticada no backend para não sobrescrever TUDO.
      // Por simplicidade, o backend atual assume que todas as imagens vêm do upload ou que são substituídas.
      // Se você quer manter imagens existentes E adicionar novas, o backend precisará ser ajustado para isso.
      // Uma abordagem seria enviar as URLs existentes como um campo de texto separado e o backend as mesclaria.
      currentImageUrls.forEach(url => {
         dataToSend.append('existingImages', url); // Exemplo de como enviar urls existentes
      });


      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          // 'Content-Type': 'multipart/form-data' é automaticamente definido pelo Axios quando você envia FormData
        },
      };

      if (isEditMode) {
        await axios.put(`<span class="math-inline">\{API\_BASE\_URL\}/produtos/</span>{id}`, dataToSend, config);
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
        {/* Outros campos do formulário (nome, descricao, etc.) aqui */}
        {/* ... (manter os campos existentes do seu ProductEdit.js/ProductNewPage.js) */}

        <div className="form-group">
          <label>Imagens do Produto (URLs existentes)</label>
          <div className="existing-images-preview">
            {currentImageUrls.map((imgUrl, index) => (
              <div key={index} className="image-preview-item">
                <img src={imgUrl} alt={`Imagem ${index}`} className="product-thumbnail" />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(imgUrl)}
                  className="btn btn-danger btn-sm"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>

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

        {/* Checkbox emDestaque e Botões de Ação */}
        {/* ... (manter os campos restantes do seu ProductEdit.js/ProductNewPage.js) */}

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

// Exportar como ProductEdit ou ProductNewPage, dependendo do uso
export default ProductPage;