import GuestCheckPad from "../../entities/GuestCheckPad";
import IGuestCheckPadRepository from "../../entities/interfaces/IGuestCheckPadRepository"

export default class CreateGuestCheckPad{
    constructor(readonly guestCheckPadRepository: IGuestCheckPadRepository){}

    execute(input: Input): void{
        const guestCheckPad = GuestCheckPad.create({description: input.description});
        this.guestCheckPadRepository.save(guestCheckPad)
    }
}

type Input = {
    description: string
}