const BaseCommand = require('../baseCommand');
const { Facultad } = require('../../models');

class UpdateFacultadCommand extends BaseCommand {
  async execute() {
    const [updated] = await Facultad.update(this.data, { 
      where: { id: this.data.id } 
    });
    
    if (!updated) throw new Error('Facultad no encontrada');
    
    const facultad = await Facultad.findByPk(this.data.id);
    //aqui falta hacer el callback para confirmar al cliente
    console.log({ success: true, facultad });
  }
}

module.exports = UpdateFacultadCommand;