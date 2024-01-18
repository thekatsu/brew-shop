import GuestCheckPad from "../GuestCheckPad"

export default interface IGuestCheckPadRepository {
    save(guestCheckPad: GuestCheckPad): void
    getByCode(code: string): GuestCheckPad
}