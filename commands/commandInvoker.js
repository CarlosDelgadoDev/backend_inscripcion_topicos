const CreateFacultadCommand = require('./facultad/createFacultadCommand');
const UpdateFacultadCommand = require('./facultad/updateFacultadCommand');


class CommandInvoker {

    commands = {
        'create_facultad': CreateFacultadCommand,
        'update_facultad': UpdateFacultadCommand,
        //'delete_facultad': DeleteFacultadCommand,
        //'get_facultad': GetFacultadCommand
    };


    static createCommand(commandType, data) {
        const CommandClass = this.commands[commandType];
        if (!CommandClass) {
            throw new Error(`Tipo de comando no soportado: ${commandType}`);
        }
        return new CommandClass(data);
    }
}   

module.exports = CommandInvoker;