import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Defina API_BASE_URL aqui, como já está
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo) {
      setCurrentUser(userInfo);
    }
    
    setLoading(false);
  }, []);

  // Login
  const login = async (email, senha) => {
    try {
      // Mude aqui: use API_BASE_URL
      const { data } = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        senha
      });

      setCurrentUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao fazer login';
    }
  };

  // Registro
  const register = async (nome, email, senha) => {
    try {
      // Mude aqui: use API_BASE_URL
      const { data } = await axios.post(`${API_BASE_URL}/users/register`, {
        nome,
        email,
        senha
      });

      setCurrentUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Erro ao registrar usuário';
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('userInfo');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};