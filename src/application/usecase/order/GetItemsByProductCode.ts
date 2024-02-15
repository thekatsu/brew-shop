import IOrderRepository from "../../domain/interfaces/IOrderRepository"
import IProductRepository from "../../domain/interfaces/IProductRepository"

export default class getItemsByProductCode {

    constructor(
        readonly orderRepository: IOrderRepository,
        readonly productRepository: IProductRepository
    ){}

    execute(input: Input): Output[]{
        return this.orderRepository
            .getItemsByProductId(input.orderCode, input.productCode)
            .map((item)=>{
                return {
                    productCode: item.getProductId(), 
                    description: this.productRepository.getById(item.getProductId()).getDescription(),
                    quantity: item.getQuantity(), 
                    value: item.getValue(),
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
    quantity:number
    value:number
    total:number
}