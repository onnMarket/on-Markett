module.exports = (sequelize, DataTypes) => {
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
      defaultValue: 'pedido feito'
    }
  }, {
    freezeTableName: true,
    timestamps: true
  });

  Pedido.associate = (models) => {
    Pedido.hasMany(models.PedidoItem, { foreignKey: 'pedidoId' });
    Pedido.belongsTo(models.User, { foreignKey: 'compradorId' });
  };

  return Pedido;
};
