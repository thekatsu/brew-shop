import IOrderRepository from "../../entities/interfaces/IOrderRepository";
import IProductRepository from "../../entities/interfaces/IProductRepository";

export default class getItemsByProductCode {

    constructor(
        readonly orderRepository: IOrderRepository,
        readonly productRepository: IProductRepository
    ){}

    execute(input: Input): Output[]{
        return this.orderRepository
            .getItemsByProductCode(input.orderCode, input.productCode)
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
export type Input = {
    orderCode: string,
    productCode: string
}

export type Output = {
    productCode:string
    description:string
    sequence:number
    quantity:number
    price:number
    total:number
}