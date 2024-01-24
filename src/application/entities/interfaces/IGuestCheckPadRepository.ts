import GuestCheckPad from "../GuestCheckPad"
import Item from "../Item"

export default interface IGuestCheckPadRepository {
    save(guestCheckPad: GuestCheckPad): void
    getByCode(code: string): GuestCheckPad
    getAll():GuestCheckPad[]
    getItemsByProductCode(guestCheckPadCode: string, productCode: string):Item[]
}