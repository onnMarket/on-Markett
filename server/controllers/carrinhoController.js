const { Carrinho, CarrinhoItem, Produto, Pedido, PedidoItem } = require('../models');


exports.getCarrinho = async (req, res) => {
  try {
    const { compradorId } = req.params;
    const carrinho = await Carrinho.findOne({ where: { compradorId } });

    if (!carrinho) return res.json({ itens: [] });

    const itens = await CarrinhoItem.findAll({
      where: { carrinhoId: carrinho.id },
      include: [{ model: Produto }]
    });

    res.json({ carrinhoId: carrinho.id, itens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adicionarItem = async (req, res) => {
  try {
    const { compradorId, produtoId, quantidade } = req.body;

    let carrinho = await Carrinho.findOne({ where: { compradorId } });
    if (!carrinho) {
      carrinho = await Carrinho.create({ compradorId });
    }

    let item = await CarrinhoItem.findOne({
      where: { carrinhoId: carrinho.id, produtoId }
    });

    if (item) {
      item.quantidade += quantidade;
      await item.save();
    } else {
      await CarrinhoItem.create({
        carrinhoId: carrinho.id,
        produtoId,
        quantidade
      });
    }

    res.json({ message: 'Item adicionado ao carrinho com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removerItem = async (req, res) => {
  try {
    const { carrinhoId, produtoId } = req.params;

    const item = await CarrinhoItem.findOne({
      where: { carrinhoId, produtoId }
    });

    if (!item) return res.status(404).json({ error: 'Item não encontrado no carrinho.' });

    await item.destroy();
    res.json({ message: 'Item removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.finalizarCarrinho = async (req, res) => {
  try {
    const { compradorId, formaPagamento } = req.body;

    const carrinho = await Carrinho.findOne({ where: { compradorId } });
    if (!carrinho) return res.status(400).json({ error: 'Carrinho não encontrado.' });

    const itens = await CarrinhoItem.findAll({ where: { carrinhoId: carrinho.id } });
    if (itens.length === 0) return res.status(400).json({ error: 'Carrinho vazio.' });

    // Verifica estoque
    for (const item of itens) {
      const produto = await Produto.findByPk(item.produtoId);
      if (!produto || produto.quantidade_estoque < item.quantidade) {
        return res.status(400).json({ error: `Estoque insuficiente para o produto ID ${item.produtoId}` });
      }
    }

    const pedido = await Pedido.create({
      compradorId,
      formaPagamento,
      data: new Date()
    });

    for (const item of itens) {
      const produto = await Produto.findByPk(item.produtoId);

      await PedidoItem.create({
        pedidoId: pedido.id,
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        preco_unitario: produto.preco
      });

      await produto.update({
        quantidade_estoque: produto.quantidade_estoque - item.quantidade
      });
    }

    // Limpa o carrinho após compra
    await CarrinhoItem.destroy({ where: { carrinhoId: carrinho.id } });

    res.json({ message: 'Compra realizada com sucesso.', pedidoId: pedido.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
