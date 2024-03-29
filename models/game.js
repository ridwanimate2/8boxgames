'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Game.belongsTo(models.User, { foreignKey: "UserId" })
      Game.belongsToMany(models.User, { through: models.Library })
    }
  }
  Game.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      }
    },
    imageurl: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};