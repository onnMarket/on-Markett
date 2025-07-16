const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.post('/produtos', produtoController.createProduto);
router.get('/produtos', produtoController.getAllProdutos);
router.get('/produtos/:id', produtoController.getProdutoById);
router.put('/produtos/:id', produtoController.updateProduto);
router.delete('/produtos/:id', produtoController.deleteProduto);

module.exports = router;
