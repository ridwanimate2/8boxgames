'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Consumer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Consumer.belongsTo(models.User, {foreignKey: "UserId"})
    }
  }
  Consumer.init({
    gender: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        min: 17
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Consumer',
  });
  return Consumer;
};