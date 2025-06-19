const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Finalizar compra (criar pedido)
router.post('/pedidos/finalizar', pedidoController.finalizarCompra);

// Listar todos pedidos
router.get('/pedidos', pedidoController.getAllPedidos);

// Buscar pedido por id
router.get('/pedidos/:id', pedidoController.getPedidoById);
// Rota para buscar pedidos por comprador
router.get('/pedidos/comprador/:compradorId', pedidoController.getPedidosByComprador);

// Rota para atualizar status do pedido
router.patch('/pedidos/:id/status', pedidoController.updateStatus);

module.exports = router;
