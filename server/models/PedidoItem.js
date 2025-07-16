module.exports = (sequelize, DataTypes) => {
  const PedidoItem = sequelize.define('PedidoItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pedidoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });

  PedidoItem.associate = (models) => {
    PedidoItem.belongsTo(models.Pedido, { foreignKey: 'pedidoId' });
    PedidoItem.belongsTo(models.Produto, { foreignKey: 'produtoId' });
  };

  return PedidoItem;
};
