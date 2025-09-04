const BaseCommand = require('../baseCommand');
const { Estudiante } = require('../../models');

class GetEstudianteCommand extends BaseCommand {
  async execute() {
    const estudiantes = await Estudiante.findAll();
    return { success: true, estudiantes };
  }
}

module.exports = GetEstudianteCommand;
