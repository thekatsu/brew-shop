import Command from "./Command"
import Item from "./Item"

export default interface ICommandRepository {
    save(command: Command): void
    getCommandByCode(code: string): Command | undefined
}