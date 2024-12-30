import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';

import { MapslibreComponent } from './mapslibre/mapslibre.component';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsuariosComponent } from './usuarios/usuarios.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MapsViewComponent } from './maps-view/maps-view.component';
import { LoadingComponent } from './loading/loading.component';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';

import { CapasComponent } from './capas/capas.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { CapassComponent } from './capass/capass.component';
import { AbmcapasComponent } from './abmcapas/abmcapas.component';
import { AbmrolesComponent } from './abmroles/abmroles.component';
import { AbmpermisosComponent } from './abmpermisos/abmpermisos.component';
import { AbmrolespermisosComponent } from './abmrolespermisos/abmrolespermisos.component';
import { AbmatributosComponent } from './abmatributos/abmatributos.component';
import { VisualizadorComponent } from './visualizador/visualizador.component';
import { TrabajandoComponent } from './trabajando/trabajando.component';
import { VisualizadorcapasComponent } from './visualizadorcapas/visualizadorcapas.component';
import { RolesComponent } from './roles/roles.component';
import { RecuperoComponent } from './recupero/recupero.component';

/**
 * Modulos
 */

@NgModule({
  declarations: [
    MapslibreComponent,
    DashboardComponent,
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    UsuariosComponent,
    MapsViewComponent,
    LoadingComponent,
    CapasComponent,
    CapassComponent,
    AbmcapasComponent,
    AbmrolesComponent,
    AbmpermisosComponent,
    AbmrolespermisosComponent,
    AbmatributosComponent,
    VisualizadorComponent,
    TrabajandoComponent,
    VisualizadorcapasComponent,
    RolesComponent,
    RecuperoComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    NgxMapLibreGLModule,
    ColorPickerModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  exports: [],
  providers: [CapassComponent,
    MapslibreComponent,
    SidebarComponent
  ]
})
export class DashboardModule {}
