const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || user.senha !== senha) {
      return res.status(401).json({ status: 'error', error: 'Usuário ou senha inválidos' });
    }

    res.json({
      status: 'success',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        cpf: user.cpf,
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};
