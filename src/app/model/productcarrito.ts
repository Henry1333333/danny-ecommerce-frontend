export interface ProductoCarrito{
    idproducto: number,
    idcategoria: number,
    codigo: number,
    nombre: String,
    descripcion:String,
    precio: number,
    cantidad:number,
    imagen:String,
    estado: Boolean
    precioTotal?: number;
}
