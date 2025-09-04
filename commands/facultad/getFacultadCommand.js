const BaseCommand = require('../baseCommand');
const { Facultad } = require('../../models');

class GetFacultadCommand extends BaseCommand {
	async execute() {
		const facultades = await Facultad.findAll();
		return { success: true, facultades };
	}
}

module.exports = GetFacultadCommand;
