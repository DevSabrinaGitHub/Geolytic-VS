import { DashboardComponent } from './dashboard/dashboard.component';
import { MapslibreComponent } from './dashboard/mapslibre/mapslibre.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroUsuariosComponent } from './registro-usuarios/registro-usuarios.component';
import { RecuperoComponent } from './dashboard/recupero/recupero.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  //{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroUsuariosComponent },
  { path: 'recupero', component: RecuperoComponent },
  { path: 'recover-password', component: RecoverPasswordComponent },
  {
    path: 'dashboard',
    loadChildren: () =>
    import('./dashboard/dashboard.module').then((x) => x.DashboardModule)
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
  //{ path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  schemas: [
  ]
})
export class AppRoutingModule { }
