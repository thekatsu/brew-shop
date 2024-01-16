import CommandRepositoryInMemory from "../src/CommandRepositoryInMemory"
import { CreateCommand } from "../src/CreateCommand"

describe("teste de integração", ()=>{
    test("Deve criar uma comanda", ()=>{
        const repo = new CommandRepositoryInMemory()
        const input = {
            description: "João"
        }
        const command = new CreateCommand(repo).execute(input)
        expect(command.code).toBeDefined()
        expect(command.description).toBe(input.description)
        expect(command.items).toStrictEqual([])
        expect(command.total).toBe(0)
    })
})