// models/Payment.js
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    compradorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nomeTitular: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numeroCartao: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    validade: {
      type: DataTypes.STRING, // formato MM/AA
      allowNull: false,
    },
    codigoSeguranca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    limite: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    freezeTableName: true,
    timestamps: true,
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.User, { foreignKey: 'compradorId' });
  };

  return Payment;
};
