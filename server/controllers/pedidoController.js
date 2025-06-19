const Pedido = require('../models/Pedido');
const PedidoItem = require('../models/PedidoItem');
const Produto = require('../models/Produto');

// Finalizar compra (criar pedido e itens)
exports.finalizarCompra = async (req, res) => {
  try {
    const { compradorId, formaPagamento, produtos } = req.body;
    // produtos = [{ produtoId: 1, quantidade: 2 }, ...]

    if (!['credito', 'debito', 'pix'].includes(formaPagamento.toLowerCase())) {
      return res.status(400).json({ error: 'Forma de pagamento inválida' });
    }

    // Verifica estoque
    for (let item of produtos) {
      const produto = await Produto.findByPk(item.produtoId);
      if (!produto) return res.status(404).json({ error: `Produto ID ${item.produtoId} não encontrado.` });
      if (produto.quantidade_estoque < item.quantidade) {
        return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}` });
      }
    }

    // Cria pedido
    const pedido = await Pedido.create({
      compradorId,
      formaPagamento,
      data: new Date()
    });

    // Cria itens do pedido e atualiza estoque
    for (let item of produtos) {
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

    res.status(201).json({ message: 'Compra finalizada com sucesso', pedidoId: pedido.id });

  } catch (error) {
    res.status(500).json({ error: error.message });
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

// Buscar pedido por id com seus itens
exports.getPedidoById = async (req, res) => {
  try {
    const pedidoId = req.params.id;

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
