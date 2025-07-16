require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,     // 'postgres'
  process.env.DB_USER,     // 'postgres.kweqycmdexvgbgkxkpim'
  process.env.DB_PASSWORD, // 'OnMarketIFPECJBG'
  {
    host: process.env.DB_HOST,      // 'aws-0-sa-east-1.pooler.supabase.com'
    port: process.env.DB_PORT,      // 6543
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      // Caso queira passar modo de pool para transação (modo_pool)
      // depende da versão do Sequelize e suporte do driver
      // Aqui é um exemplo, pode ser necessário ajustar conforme a documentação
      // por padrão, a pool é configurada abaixo
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
      // modo pool "transaction" não é parâmetro direto do Sequelize,
      // mas do driver pg. 
      // Você pode usar o parâmetro 'mode' em dialectOptions se suportado:
      mode: process.env.DB_POOL_MODE || 'transaction',
    },
  }
);

module.exports = sequelize;
