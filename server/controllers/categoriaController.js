const { Categoria } = require('../models');

// Listar todas as categorias
exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Buscar categoria por ID
exports.getCategoriaById = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Criar nova categoria
exports.createCategoria = async (req, res) => {
  const { nome, icone, tipo, quantidade } = req.body;
  try {
    const novaCategoria = await Categoria.create({ nome, icone, tipo, quantidade });
    res.status(201).json(novaCategoria);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Atualizar categoria existente
exports.updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nome, icone, tipo, quantidade } = req.body;
  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    categoria.nome = nome ?? categoria.nome;
    categoria.icone = icone ?? categoria.icone;
    categoria.tipo = tipo ?? categoria.tipo;
    categoria.quantidade = quantidade ?? categoria.quantidade;

    await categoria.save();
    res.json(categoria);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

// Deletar categoria
exports.deleteCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await categoria.destroy();
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};
