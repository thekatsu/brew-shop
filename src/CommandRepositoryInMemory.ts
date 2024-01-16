import Command from "./Command"
import ICommandRepository from "./ICommandRepository"

export default class CommandRepositoryInMemory implements ICommandRepository {
    private commands: Command[] = []
    
    constructor(){}
    
    save(command: Command):void {
        const repoCommand = this.commands.find((command)=>command.getCode() === command.getCode())
        if(repoCommand){
            const index = this.commands.indexOf(repoCommand)
            delete this.commands[index]
        }
        this.commands.push(command)   
    }

    getCommandByCode(code: string):Command | undefined {
        return this.commands.find((command)=>command.getCode() === code)
    }
}