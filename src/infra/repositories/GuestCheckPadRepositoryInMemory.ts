import GuestCheckPad from "../../application/entities/GuestCheckPad"
import IGuestCheckPadRepository from "../../application/entities/interfaces/IGuestCheckPadRepository"

export default class GuestCheckPadRepositoryInMemory implements IGuestCheckPadRepository {
    private guestCheckPads: GuestCheckPad[] = []
    
    constructor(){}
    
    save(guestCheckPad: GuestCheckPad):void {
        if(this.guestCheckPads.indexOf(guestCheckPad) !== -1){
            this.guestCheckPads[this.guestCheckPads.indexOf(guestCheckPad)] = guestCheckPad
        } else {
            this.guestCheckPads.push(guestCheckPad)
        }
    }

    getByCode(code: string):GuestCheckPad {
        const GuestCheckPad = this.guestCheckPads.find((GuestCheckPad)=> GuestCheckPad?.getCode() === code )
        if(!GuestCheckPad) throw new Error("Comanda não encontrada!")
        return GuestCheckPad
    }

    getAll():GuestCheckPad[]{
        return this.guestCheckPads
    }
}