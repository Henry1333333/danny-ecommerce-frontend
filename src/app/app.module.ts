import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { PrimeNgModule } from 'src/prime-ng/primeng.module';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { ProductoComponent } from './components/producto/producto.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { PagoComponent } from './components/pago/pago.component';
import { UsuarioventaListComponent } from './components/usuario/usuarioventa-list/usuarioventa-list.component';
import { VentaComponent } from './components/venta/venta.component';
import { RolComponent } from './components/rol/rol.component';





@NgModule({
    declarations: [
        AppComponent, NotfoundComponent, UsuarioComponent, CategoriaComponent, ProductoComponent, InicioComponent, ProductListComponent, 
        PagoComponent, UsuarioventaListComponent, VentaComponent, RolComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        PrimeNgModule,
        NgxPayPalModule
    ],
    providers: [
        authInterceptorProviders,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
