const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/cadastrar', paymentController.cadastrarPagamento);
router.post('/finalizar', paymentController.finalizarPagamento);
router.get('/listar/:compradorId', paymentController.listarCartoes);
router.put('/editar/:id', paymentController.editarCartao);
router.delete('/deletar/:id', paymentController.deletarCartao);
module.exports = router;
