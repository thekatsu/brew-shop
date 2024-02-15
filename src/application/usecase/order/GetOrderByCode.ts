import { ORDER_STATUS } from "../../domain/entities/Order"
import IOrderRepository from "../../domain/interfaces/IOrderRepository"
import IProductRepository from "../../domain/interfaces/IProductRepository"

export default class GetOrderByCode{

    constructor(
        readonly orderRepository: IOrderRepository,
        readonly productRepository: IProductRepository
    ){}

    execute(input: Input):Output{
        const Order = this.orderRepository.getById(input.orderCode)
        return {
            code: Order.getId(),
            description: Order.getDescription(),
            total: Order.getTotal(),
            status: Order.getStatus() == ORDER_STATUS.OPEN? "open": "close",
            items: Order.getItems().map((value)=>{
                return {
                    productCode: value.getProductId(), 
                    description: this.productRepository.getById(value.getProductId()).getDescription(),
                    quantity: value.getQuantity(),
                    value: value.getValue(),
                    total: value.getTotal()
                }
            })
        }
    }
}

export type Input = {
    orderCode: string
}

export type Output = {
    code: string
    description: string
    total: number
    status: string
    items: {
        productCode: string
        description: string
        quantity: number
        value: number
        total: number
    }[]
}
