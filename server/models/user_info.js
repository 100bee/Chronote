const User_info = function (sequelize, DataTypes) {
  const model = sequelize.define(
    "user_info",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      birthdate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      tableName: "user_info",
      freezeTableName: true,
      timestamps: false,
    }
  );
  return model;
};

module.exports = User_info;