import { ProductoCarrito } from "./productcarrito";

export class CartItemModel {
    productId: number;
    productName: String;
    productPrice: number;
    qty: number;

    constructor(product: ProductoCarrito) {
        this.productId = product.idproducto;
        this.productName = product.nombre;
        this.productPrice = product.precio;
        this.qty = 1;
    }
}