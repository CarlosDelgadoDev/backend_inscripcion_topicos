const BaseCommand = require('../baseCommand');
const { Carrera } = require('../../models');

class GetCarreraCommand extends BaseCommand {
  async execute() {
    const carreras = await Carrera.findAll();
    return { success: true, carreras };
  }
}

module.exports = GetCarreraCommand;
