const Produto = require('../models/Produto');

// Criar produto
exports.createProduto = async (req, res) => {
  try {
    const { foto, categoria, descricao, preco, validade, quantidade_estoque } = req.body;
    const produto = await Produto.create({
      foto,
      categoria,
      descricao,
      preco,
      validade,
      quantidade_estoque,
    });
    res.status(201).json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar todos os produtos
exports.getAllProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar produto por id
exports.getProdutoById = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar produto por id
exports.updateProduto = async (req, res) => {
  try {
    const { foto, categoria, descricao, preco, validade, quantidade_estoque } = req.body;
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    await produto.update({ foto, categoria, descricao, preco, validade, quantidade_estoque });
    res.json(produto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Deletar produto por id
exports.deleteProduto = async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    await produto.destroy();
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
