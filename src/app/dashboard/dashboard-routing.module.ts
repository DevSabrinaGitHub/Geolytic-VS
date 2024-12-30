import { MapsViewComponent } from './maps-view/maps-view.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { GuardGuard } from './../services/guard.guard';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MapslibreComponent } from './mapslibre/mapslibre.component';
import { CapasComponent } from './capas/capas.component';
import { AbmcapasComponent } from './abmcapas/abmcapas.component';
import { VisualizadorComponent } from './visualizador/visualizador.component';
import { TrabajandoComponent } from './trabajando/trabajando.component';
import { RolesComponent } from './roles/roles.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'dashboard', pathMatch: 'full', //component: DashboardComponent,
    children: [
    ]
  },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'capas', component: AbmcapasComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'visualizador', component: VisualizadorComponent },
  { path: 'trabajando', component: TrabajandoComponent },
  { path: 'mapslibre', component: MapslibreComponent },
  { path: '**', component: DashboardComponent, pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class DashboardRoutingModule { }
