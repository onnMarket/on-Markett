const User = require('../models/User');

// Criar usuário
exports.createUser = async (req, res) => {
  try {
    const { nome, email, tipo, cpf, senha } = req.body;
    const user = await User.create({ nome, email, tipo, cpf, senha });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todos usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar usuário por id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar usuário por id
exports.updateUser = async (req, res) => {
  try {
    const { nome, email, tipo, cpf, senha } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    await user.update({ nome, email, tipo, cpf, senha });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar usuário por id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    await user.destroy();
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
