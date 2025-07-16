const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');

router.get('/:compradorId', carrinhoController.getCarrinho);
router.post('/adicionar', carrinhoController.adicionarItem);
router.delete('/:carrinhoId/:produtoId', carrinhoController.removerItem);
router.post('/finalizar', carrinhoController.finalizarCarrinho);

module.exports = router;
