'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Materia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
  Materia.hasMany(models.Detalle_materia, { foreignKey: 'materiaId' });
  Materia.hasMany(models.Pre_requisito, { foreignKey: 'materiaId' });
  Materia.hasMany(models.Pre_requisito, { foreignKey: 'prerequisitoId' });
  Materia.hasMany(models.Grupo_Materia, { foreignKey: 'materiaId' });
    }
  }
  Materia.init({
    nombre: DataTypes.STRING,
    horasDeEstudio: DataTypes.INTEGER,
    sigla: DataTypes.STRING,
    nivel: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Materia',
    tableName: 'Materias', // 👈 nombre exacto de la tabla
  });
  return Materia;
};