import { ORDER_STATUS } from "../../entities/Order";
import IOrderRepository from "../../entities/interfaces/IOrderRepository";
import IProductRepository from "../../entities/interfaces/IProductRepository";

export default class GetOrderByCode{

    constructor(
        readonly orderRepository: IOrderRepository,
        readonly productRepository: IProductRepository
    ){}

    execute(input: Input):Output{
        const Order = this.orderRepository.getByCode(input.orderCode)
        return {
            code: Order.getCode(),
            description: Order.getDescription(),
            total: Order.getTotal(),
            status: Order.getStatus() == ORDER_STATUS.OPEN? "open": "close",
            items: Order.getItems().map((value)=>{
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
        sequence: number
        quantity: number
        price: number
        total: number
    }[]
}
