import IGuestCheckPadRepository from "../../entities/interfaces/IGuestCheckPadRepository";
import IProductRepository from "../../entities/interfaces/IProductRepository";

export default class AddProductInGuestCheckPad{
    constructor(private guestCheckPadRepository: IGuestCheckPadRepository, private productRepository: IProductRepository){}

    execute(input: Input):void {
        const product = this.productRepository.getByCode(input.product_code)
        if(!product) throw new Error("Produto não encontado!")
        const guestCheckPad = this.guestCheckPadRepository.getByCode(input.guestcheckpad_code)
        if(!guestCheckPad) throw new Error("Comanda não encontrada!")
        if(!guestCheckPad.getItems().some((item)=>item.getProductCode() === input.product_code))
            guestCheckPad.addItem(product.code, product.description, product.price, 0)
        guestCheckPad.increaseAmount(input.product_code, 1)
        this.guestCheckPadRepository.save(guestCheckPad)
    }
}

type Input = {
    guestcheckpad_code: string,
    product_code: string
}