module.exports = (sequelize, DataTypes) => {
  const Carrinho = sequelize.define('Carrinho', {
    compradorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Carrinho.associate = (models) => {
    Carrinho.hasMany(models.CarrinhoItem, { foreignKey: 'carrinhoId' });
  };

  return Carrinho;
};
