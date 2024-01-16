import { randomUUID } from 'crypto'
import Command from "./Command";
import ICommandRepository from "./ICommandRepository"

export class CreateCommand{
    constructor(readonly commandRepository: ICommandRepository){}

    execute(input: Input): Output{
        const command = new Command(randomUUID(), input.description);
        this.commandRepository.save(command)
        let items:OutputItems[] = []
        for(const item of command.getItems()){
            items.push({
                code: item.getCode(),
                description: item.getDescription(),
                amount: item.getAmount(),
                price: item.getPrice(),
                total: item.getTotal()
            })
        }
        return {
            code: command.getCode(),
            description: command.getDescription(),
            items,
            total: command.getTotal()
        }
    }
}

type Input = {
    description: string
}

type Output = {
    code: string
    description: string
    items: OutputItems[]
    total: number
}

type OutputItems = {
    code: string
    description: string
    amount: number
    price: number
    total: number
}