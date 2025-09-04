const BaseCommand = require('../baseCommand');
const { Docente } = require('../../models');

class GetDocenteCommand extends BaseCommand {
  async execute() {
    const docentes = await Docente.findAll();
    return { success: true, docentes };
  }
}

module.exports = GetDocenteCommand;
