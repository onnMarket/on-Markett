const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

app.use(express.json());
app.use(cors());

// Rotas
const userRoutes = require('./routes/userRoutes');
const produtoRoutes = require('./routes/produtoRoutes'); 
const loginRoutes = require('./routes/loginRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const paymentRoutes = require('./routes/paymentRoutes');  // rota pagamento

app.use('/api', userRoutes);
app.use('/api', produtoRoutes);  
app.use('/api', loginRoutes);
app.use('/api', pedidoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/payment', paymentRoutes);  // registrar rota

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false, alter:true })
  .then(() => {
    console.log('Banco sincronizado com sucesso!');
    app.listen(PORT, '0.0.0.0', () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((error) => {
    console.error('Erro ao sincronizar banco:', error);
  });
