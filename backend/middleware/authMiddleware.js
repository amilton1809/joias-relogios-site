const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware para proteger rotas
const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token existe no header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        // Obter token do header
        token = req.headers.authorization.split(' ')[1];

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'abc123');

        // Obter usuário do token
        req.user = await User.findById(decoded.id).select('-senha');

        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Não autorizado, token inválido' });
      }
    }

    if (!token) {
      res.status(401).json({ message: 'Não autorizado, sem token' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware para verificar se o usuário é admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Não autorizado como administrador' });
  }
};

module.exports = { protect, admin };
