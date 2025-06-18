const { DataTypes } = require('sequelize');
const sequelize = require('../database/database'); // ajuste o caminho conforme seu projeto

const Produto = sequelize.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nome: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  foto: {
    type: DataTypes.STRING, // pode ser URL ou caminho da imagem
    allowNull: true,        // pode ser opcional
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2), // valor monetário com 2 casas decimais
    allowNull: false,
  },
  validade: {
    type: DataTypes.DATE,
    allowNull: true, // pode ser opcional dependendo do produto
  },
  quantidade_estoque: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  freezeTableName: true, // para usar o nome da tabela como 'Produto'
  timestamps: true,      // createdAt e updatedAt automáticos
});

module.exports = Produto;
