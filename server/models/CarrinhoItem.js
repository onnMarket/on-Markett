

module.exports = (sequelize, DataTypes) => {
  const CarrinhoItem = sequelize.define('CarrinhoItem', {
    carrinhoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  });

  CarrinhoItem.associate = (models) => {
  CarrinhoItem.belongsTo(models.Produto, { foreignKey: 'produtoId' });
  CarrinhoItem.belongsTo(models.Carrinho, { foreignKey: 'carrinhoId' }); // <-- ADICIONE ISSO
};


  return CarrinhoItem;
};
