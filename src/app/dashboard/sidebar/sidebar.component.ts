import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapslibreComponent } from '../mapslibre/mapslibre.component';
import { CapasComponent } from '../capas/capas.component';
import { Capa } from '../capa';
import { FormBuilder, FormGroup } from '@angular/forms';

interface MenuItem {
  name: string;
  route: string;
  icon: string;
  show?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  nombre_usuario = localStorage.getItem('usuario');
  rol = localStorage.getItem('rol');
  visible: boolean = false;
  form_WMS: FormGroup;
  menuItems: MenuItem[] = [];
  

  constructor( private router: Router,
               private MapsLibre: MapslibreComponent,
               private fromWMS: FormBuilder) {
    this.form_WMS = this.fromWMS.group({
      nombreWMS: ['vueLO'],
      URLWMS: ['https://imagenes.ign.gob.ar/geoserver/gwc/service/wms'],
      capaWMS: ['mosaicos_vuelos_vant']

    });
                }

  ngOnInit(): void {
    this.initializeMenuItems();
  }

  initializeMenuItems() {
     // Este valor debe ser obtenido dinámicamente según tus necesidades
    this.menuItems = [
      { name: 'Visualizador', route: 'dashboard/visualizador', icon: 'fas fa-map' },
      { name: 'Usuarios', route: 'dashboard/usuarios', icon: 'fas fa-user', show: this.rol === '1' || this.rol === '2' },
      { name: 'Roles', route: 'dashboard/roles', icon: 'fas fa-user', show: this.rol === '1' || this.rol === '2' },
      { name: 'Capas', route: 'dashboard/capas', icon: 'fas fa-user', show: this.rol === '1' || this.rol === '2' },
      { name: 'Atributos por capas', route: 'dashboard/trabajando', icon: 'fas fa-user', show: this.rol === '1' || this.rol === '2' },
      { name: 'Tipo de atributos', route: 'dashboard/trabajando', icon: 'fas fa-user' },
    ];
  }

  salir(){
    localStorage.clear();
    this.router.navigate(['/']);
  }
  
  agregaCapa(){
    //this.MapsLibre.agregaCapa();
    this.listacapa.push({
      id: 0,
      nombre: 'nodos',
      color: '#123456',
      visible: true,
      descripcion: 'warawara',
      transparencia: 0.75,
      tipo: 'circle'
    });
    this.listacapa.push({
      id: 0,
      nombre: 'quejas',
      color: '#123456',
      visible: true,
      descripcion: 'quejas',
      transparencia: 1,
      tipo: 'circle'
    });
    this.listacapa.push({
      id: 3,
      nombre: 'nombrecapa',
      color: '#123456',
      visible: true,
      descripcion: 'agregadaconotrallamada',
      transparencia: 1,
      tipo: 'line'
    });
    this.listacapa.push({
      id: 4,
      nombre: 'yerba_rec_demo',
      color: '#123456',
      visible: true,
      descripcion: 'yerba',
      transparencia: 1,
      tipo: 'fill'
    });
  }

  mostrarParametrosWMS(){
    if(this.visible){this.visible = false} else {this.visible = true};
  }


  quitarCapa(capa: Capa){
    //console.log(idcapa);
    const index = this.listacapa.indexOf(capa, 0);
    if (index > -1) {
      this.listacapa.splice(index, 1);
    }
  }

  changeStyle(capa: string){
    this.MapsLibre.changeStyle(capa);
  }

  /* capa: Capa = {
    id: 0,
    nombre: 'nodos',
    color: '#123456',
    visible: false,
    descripcion: 'warawara',
    transparencia: 0.75
  };*/

  listacapa: Capa[] = [
  {
    id: 1,
    nombre: 'localidades',
    color: '#654321',
    visible: true,
    descripcion: 'ipsemlorum',
    transparencia: 0.25,
    tipo: 'circle'
  }];
}
