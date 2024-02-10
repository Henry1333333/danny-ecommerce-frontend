import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { ProductoCarrito } from '../model/productcarrito';

@Injectable({
  providedIn: 'root'
})
export class ShoppingcartService {

  productosEnCarrito: ProductoCarrito[] = [];
  private _productosEnCarrito$ = new BehaviorSubject<ProductoCarrito[]>([]);
  
  get productosEnCarrito$() {
    return this._productosEnCarrito$.asObservable();
  }
  
  agregarAlCarrito(producto: ProductoCarrito) {
    const productoExistente = this.productosEnCarrito.find(p => p.idproducto === producto.idproducto);
  
    if (productoExistente) {
      productoExistente.cantidad++;
      productoExistente.precioTotal = productoExistente.precio * productoExistente.cantidad;
    } else {
      const nuevoProducto: ProductoCarrito = {
        ...producto,
        cantidad: 1,
        precioTotal: producto.precio,
      };
      this.productosEnCarrito.push(nuevoProducto);
    }
  
    this.actualizarPrecioTotalCarrito(); 
    this._productosEnCarrito$.next([...this.productosEnCarrito]);
  }
  
  actualizarPrecioTotalCarrito() {
    const precioTotalCarrito = this.productosEnCarrito.reduce((total, producto) => total + (producto.precioTotal || 0), 0); 
  }

  obtenerPrecioTotal(): number {
    const productosEnCarrito = this._productosEnCarrito$.value;
    return productosEnCarrito.reduce((total, producto) => total + producto.precioTotal, 0);
  }
  
  obtenerProductos() {
    return this.productosEnCarrito;
  }
  obtenerProductosEnCarrito(): ProductoCarrito[] {
    return this.productosEnCarrito;
  }

  limpiarCarrito() {
    this.productosEnCarrito = [];
    return this.productosEnCarrito;
  }
}
