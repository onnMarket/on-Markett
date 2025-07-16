const { Payment, Produto, Pedido, PedidoItem, Carrinho, CarrinhoItem, sequelize } = require('../models');

exports.cadastrarPagamento = async (req, res) => {
  try {
    const { compradorId, nomeTitular, numeroCartao, validade, codigoSeguranca, limite } = req.body;

    // Aqui você pode adicionar validações extras (formato do cartão, validade, etc)

    const novoPagamento = await Payment.create({
      compradorId,
      nomeTitular,
      numeroCartao,
      validade,
      codigoSeguranca,
      limite,
    });

    res.status(201).json(novoPagamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listarCartoes = async (req, res) => {
  try {
    const { compradorId } = req.params;
    const cartoes = await Payment.findAll({ where: { compradorId } });
    res.status(200).json(cartoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar cartões' });
  }
};

// ------------------
// EDITAR CARTÃO
// ------------------
exports.editarCartao = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomeTitular, numeroCartao, validade, codigoSeguranca, limite } = req.body;

    const cartao = await Payment.findByPk(id);
    if (!cartao) {
      return res.status(404).json({ error: 'Cartão não encontrado' });
    }

    await cartao.update({
      nomeTitular,
      numeroCartao,
      validade,
      codigoSeguranca,
      limite,
    });

    res.status(200).json({ message: 'Cartão atualizado com sucesso', cartao });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar cartão' });
  }
};

// ------------------
// DELETAR CARTÃO
// ------------------
exports.deletarCartao = async (req, res) => {
  try {
    const { id } = req.params;

    const cartao = await Payment.findByPk(id);
    if (!cartao) {
      return res.status(404).json({ error: 'Cartão não encontrado' });
    }

    await cartao.destroy();
    res.status(200).json({ message: 'Cartão deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar cartão' });
  }
};

exports.finalizarPagamento = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { compradorId, formaPagamento, pagamentoId } = req.body;

    // 1. Buscar pagamento pelo pagamentoId e compradorId
    const pagamento = await Payment.findOne({ where: { id: pagamentoId, compradorId } });
    if (!pagamento) {
      await t.rollback();
      return res.status(404).json({ error: 'Dados de pagamento não encontrados' });
    }

    // 2. Buscar carrinho do comprador
    const carrinho = await Carrinho.findOne({ where: { compradorId }, transaction: t });
    if (!carrinho) {
      await t.rollback();
      return res.status(404).json({ error: 'Carrinho não encontrado' });
    }

    // 3. Buscar itens do carrinho
    const itensCarrinho = await CarrinhoItem.findAll({ where: { carrinhoId: carrinho.id }, transaction: t });
    if (itensCarrinho.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    // 4. Calcular total e verificar estoque
    let totalCompra = 0;
    for (const item of itensCarrinho) {
      const produto = await Produto.findByPk(item.produtoId, { transaction: t });
      if (!produto) {
        await t.rollback();
        return res.status(404).json({ error: `Produto ID ${item.produtoId} não encontrado.` });
      }
      if (produto.quantidade_estoque < item.quantidade) {
        await t.rollback();
        return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}` });
      }
      totalCompra += parseFloat(produto.preco) * item.quantidade;
    }

    // 5. Verificar limite do pagamento
    if (parseFloat(pagamento.limite) < totalCompra) {
      await t.rollback();
      return res.status(400).json({ error: 'Limite do cartão insuficiente para essa compra' });
    }

    // 6. Criar pedido
    const pedido = await Pedido.create({
      compradorId,
      formaPagamento,
      data: new Date(),
      status: 'pedido feito',
    }, { transaction: t });

    // 7. Criar itens do pedido e atualizar estoque
    for (const item of itensCarrinho) {
      const produto = await Produto.findByPk(item.produtoId, { transaction: t });

      await PedidoItem.create({
        pedidoId: pedido.id,
        produtoId: produto.id,
        quantidade: item.quantidade,
        preco_unitario: produto.preco,
      }, { transaction: t });

      // Atualiza estoque
      await produto.update({
        quantidade_estoque: produto.quantidade_estoque - item.quantidade,
      }, { transaction: t });
    }

    // 8. Debitar valor do limite no pagamento
    await pagamento.update({
      limite: parseFloat(pagamento.limite) - totalCompra
    }, { transaction: t });

    // 9. Limpar carrinho (deletar itens)
    await CarrinhoItem.destroy({ where: { carrinhoId: carrinho.id }, transaction: t });

    // 10. Commit da transação
    await t.commit();

    // 11. Resposta de sucesso
    return res.status(201).json({ message: 'Compra finalizada com sucesso', pedidoId: pedido.id });

  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({ error: 'Erro ao finalizar pagamento' });
  }
};
