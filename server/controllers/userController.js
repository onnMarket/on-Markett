const { User } = require('../models'); // Vai pegar db.User
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const { nome, email, tipo, cpf, senha } = req.body;

    const hashedSenha = await bcrypt.hash(senha, 10); // 10 = salt rounds

    const user = await User.create({
      nome,
      email,
      tipo,
      cpf,
      senha: hashedSenha
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { nome, email, tipo, cpf, senha } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    let updatedData = { nome, email, tipo, cpf };

    if (senha) {
      updatedData.senha = await bcrypt.hash(senha, 10);
    }

    await user.update(updatedData);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const novaSenha = crypto.randomBytes(6).toString('hex');
    const hashedNovaSenha = await bcrypt.hash(novaSenha, 10);

    user.senha = hashedNovaSenha;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ejns1@discente.ifpe.edu.br',
        pass: 'asufvenmrvvaipet'
      }
    });

    const mailOptions = {
      from: 'ejns1@discente.ifpe.edu.br',
      to: email,
      subject: 'Nova senha de acesso',
      text: `Olá, ${user.nome}!\n\nSua nova senha é: ${novaSenha}\n\nRecomendamos que você altere esta senha após o login.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Nova senha enviada por e-mail com sucesso.' });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    res.status(500).json({ error: 'Erro ao resetar senha.' });
  }
};
