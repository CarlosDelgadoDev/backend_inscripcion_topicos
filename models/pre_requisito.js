'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pre_requisito extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
  Pre_requisito.belongsTo(models.Materia, { foreignKey: 'materiaId' });
  Pre_requisito.belongsTo(models.Materia, { foreignKey: 'prerequisitoId' });
    }
  }
  Pre_requisito.init({
    materiaId: DataTypes.INTEGER,
    prerequisitoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pre_requisito',
    tableName: 'Pre_requisitos', // 👈 nombre exacto de la tabla
  });
  return Pre_requisito;
};