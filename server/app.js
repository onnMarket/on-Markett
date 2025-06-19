const express = require('express');
const app = express();
const sequelize = require('./database/database'); 

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const produtoRoutes = require('./routes/produtoRoutes'); 
const loginRoutes = require('./routes/loginRoutes');
const pedidoRoues = require('./routes/pedidoRoutes');

app.use('/api', userRoutes);
app.use('/api', produtoRoutes);  
app.use('/api', loginRoutes);
app.use('/api', pedidoRoues);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
  .then(() => {
    console.log('Banco sincronizado com sucesso!');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((error) => {
    console.error('Erro ao sincronizar banco:', error);
  });
