const { Produto, Pedido, PedidoItem, Carrinho, CarrinhoItem, Payment } = require('../models');

exports.finalizarCompra = async (req, res) => {
  try {
    const { compradorId, formaPagamento, pagamentoDados } = req.body;
    // pagamentoDados = { numeroCartao, validade, codigoSeguranca }

    if (!['credito', 'debito', 'pix'].includes(formaPagamento.toLowerCase())) {
      return res.status(400).json({ error: 'Forma de pagamento inválida' });
    }

    // Busca o pagamento cadastrado pelo comprador (simulando validação)
    const pagamento = await Payment.findOne({
      where: {
        compradorId,
        numeroCartao: pagamentoDados.numeroCartao,
        validade: pagamentoDados.validade,
        codigoSeguranca: pagamentoDados.codigoSeguranca,
      }
    });

    if (!pagamento) {
      return res.status(400).json({ error: 'Dados de pagamento inválidos' });
    }

    // Pega o carrinho e itens
    const carrinho = await Carrinho.findOne({ where: { compradorId } });
    if (!carrinho) return res.status(400).json({ error: 'Carrinho não encontrado' });

    const itens = await CarrinhoItem.findAll({ where: { carrinhoId: carrinho.id } });
    if (itens.length === 0) return res.status(400).json({ error: 'Carrinho vazio' });

    // Calcula valor total
    let valorTotal = 0;
    for (const item of itens) {
      const produto = await Produto.findByPk(item.produtoId);
      if (!produto) return res.status(400).json({ error: `Produto ID ${item.produtoId} não encontrado` });

      if (produto.quantidade_estoque < item.quantidade) {
        return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}` });
      }

      valorTotal += produto.preco * item.quantidade;
    }

    // Verifica limite do cartão
    if (pagamento.limite < valorTotal) {
      return res.status(400).json({ error: 'Limite do cartão insuficiente para esta compra' });
    }

    // Deduz limite (simula pagamento aprovado)
    await pagamento.update({
      limite: pagamento.limite - valorTotal
    });

    // Cria pedido
    const pedido = await Pedido.create({
      compradorId,
      formaPagamento,
      data: new Date(),
      status: 'pedido feito',
    });

    // Cria itens do pedido e atualiza estoque
    for (const item of itens) {
      const produto = await Produto.findByPk(item.produtoId);

      await PedidoItem.create({
        pedidoId: pedido.id,
        produtoId: produto.id,
        quantidade: item.quantidade,
        preco_unitario: produto.preco
      });

      await produto.update({
        quantidade_estoque: produto.quantidade_estoque - item.quantidade
      });
    }

    // Limpa carrinho
    await CarrinhoItem.destroy({ where: { carrinhoId: carrinho.id } });

    return res.status(201).json({ message: 'Compra finalizada com sucesso', pedidoId: pedido.id });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


// Listar todos pedidos
exports.getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPedidoById = async (req, res) => {
  try {
    const pedidoId = req.params.id;  // <-- aqui

    if (!pedidoId) {
      return res.status(400).json({ error: 'ID do pedido não fornecido' });
    }

    const pedido = await Pedido.findByPk(pedidoId);
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

    const itens = await PedidoItem.findAll({ where: { pedidoId } });

    res.json({ ...pedido.toJSON(), itens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Buscar pedidos pelo compradorId
exports.getPedidosByComprador = async (req, res) => {
  try {
    const compradorId = req.params.compradorId;
    const pedidos = await Pedido.findAll({ where: { compradorId } });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar status do pedido
exports.updateStatus = async (req, res) => {
  try {
    const pedidoId = req.params.id;

    const statusValidos = ['pedido feito', 'em separação', 'pedido no balcão', 'entregue'];

    const pedido = await Pedido.findByPk(pedidoId);
    if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

    const statusAtual = pedido.status.toLowerCase();

    const indexAtual = statusValidos.indexOf(statusAtual);
    if (indexAtual === -1) {
      return res.status(400).json({ error: 'Status atual do pedido inválido' });
    }

    // Se já estiver no último status, não avança mais
    if (indexAtual === statusValidos.length - 1) {
      return res.status(400).json({ error: 'Pedido já está no status final' });
    }

    const proximoStatus = statusValidos[indexAtual + 1];

    pedido.status = proximoStatus;
    await pedido.save();

    res.json({ message: `Status atualizado para '${proximoStatus}'`, pedido });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
