import { LoginComponent } from './login/login.component';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MapslibreComponent } from './dashboard/mapslibre/mapslibre.component';
import { RegistroUsuariosComponent } from './registro-usuarios/registro-usuarios.component';
import { RecuperoComponent } from './dashboard/recupero/recupero.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroUsuariosComponent,
    RecoverPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    //MapslibreComponent
//    NgxMapLibreGLModule
  ],
 // providers: [],
  bootstrap: [AppComponent],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
