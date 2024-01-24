import GuestCheckPad, { GUESTCHECKPAD_STATUS } from "../../entities/GuestCheckPad";
import IGuestCheckPadRepository from "../../entities/interfaces/IGuestCheckPadRepository";
import IProductRepository from "../../entities/interfaces/IProductRepository";

export default class GuestCheckPadService {

    constructor(
        readonly guestCheckPadRepository: IGuestCheckPadRepository,
        readonly productRepository: IProductRepository
    ){}

    create(input: InputCreate = {}):void{
        const guestCheckPad = GuestCheckPad.create(input.description);
        this.guestCheckPadRepository.save(guestCheckPad)
    }

    getByCode(input: InputGetByCode):OutputGetByCode{
        const guestCheckPad = this.guestCheckPadRepository.getByCode(input.guestCheckPadCode)
        return {
            code: guestCheckPad.getCode(),
            description: guestCheckPad.getDescription(),
            total: guestCheckPad.getTotal(),
            status: guestCheckPad.getStatus(),
            items: guestCheckPad.getItems().map((value)=>{
                return {
                    productCode: value.getProductCode(), 
                    description: this.productRepository.getByCode(value.getProductCode()).getDescription(),
                    sequence: value.getSequence(),
                    quantity: value.getQuantity(),
                    price: value.getPrice(),
                    total: value.getTotal()
                }
            })
        }
    }

    addProduct(input: InputAddProduct, quantity: number = 1, sequence:number = 1):void{
        const product = this.productRepository.getByCode(input.productCode)
        const guestCheckPad = this.guestCheckPadRepository.getByCode(input.guestCheckPadCode)
        if(!guestCheckPad) throw new Error("Comanda não encontrada!")
        guestCheckPad.addItem(product.getCode(), product.getPrice(), 0)
        guestCheckPad.increaseAmount(input.productCode, sequence, quantity)
        this.guestCheckPadRepository.save(guestCheckPad)
    }

    removeProduct(input: InputRemoveProduct, quantity: number = 1, sequence:number = 1):void{
        const guestCheckPad = this.guestCheckPadRepository.getByCode(input.guestCheckPadCode)
        if(!guestCheckPad) throw new Error("Comanda não encontrada!")
        guestCheckPad.decreaseAmount(input.productCode, sequence, quantity)
        this.guestCheckPadRepository.save(guestCheckPad)
    }

    getItemsByProductCode(input: InputGetItemByProductCode): OutputGetItemByProductCode[]{
        return this.guestCheckPadRepository
            .getItemsByProductCode(input.guestCheckPadCode, input.productCode)
            .map((item)=>{
                return {
                    productCode: item.getProductCode(), 
                    description: this.productRepository.getByCode(item.getProductCode()).getDescription(),
                    sequence: item.getSequence(), 
                    quantity: item.getQuantity(), 
                    price: item.getPrice(),
                    total: item.getTotal()
                }
            })
    }
    
}

export type InputCreate = {
    description?:string
}

export type OutputGetByCode = {
    code:string
    description:string
    total:number
    status:GUESTCHECKPAD_STATUS
    items: OutputGetItemByProductCode[]
}

export type InputGetByCode = {
    guestCheckPadCode: string
}

export type InputAddProduct = {
    guestCheckPadCode: string,
    productCode: string
}

export type InputRemoveProduct = {
    guestCheckPadCode: string,
    productCode: string
}

export type InputGetItemByProductCode = {
    guestCheckPadCode: string,
    productCode: string
}

export type OutputGetItemByProductCode = {
    productCode:string
    description:string
    sequence:number
    quantity:number
    price:number
    total:number
}