export interface Usuario{
    id: number,
    username: String,
    password: String,
    nombre: String,
    apellido:String,
    email: String,
    telefono:String,
    dni:String,
    direccion: String,
    perfil:String,
    estado: Boolean
}

export interface UsuarioVenta{
    fechaVenta: Date,
    precioTotal: number,
    producto: String,
    imagen:String,
    precioUnitario: number,
    cantidad:number,
}