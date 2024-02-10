export interface Ventas{
    idventa: number,
    idusuario: number,
    tipoComprobate: String,
    tipoEntrega: String,
    fecha: Date,
    precioTotal:number,
    estado: Boolean
}

export interface ReporteVentas{
    idventa: number,
    nombrecliente: String,
    apellidocliente: String,
    dnicliente: String,
    tipoComprobate: String,
    tipoEntrega: String,
    fechaVenta: string,
    preciototal:number,
    producto: String,
    cantidad:number,
    precioUnitario:number
}