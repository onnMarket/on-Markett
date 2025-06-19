const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Pedido = sequelize.define('Pedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  compradorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  formaPagamento: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pedido feito' // status inicial
  }
}, {
  freezeTableName: true,
  timestamps: true
});

module.exports = Pedido;
