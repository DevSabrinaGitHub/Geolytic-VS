import { Component, Input, OnInit } from '@angular/core';
import { Capa } from '../capa';
import { MapService } from 'src/app/services/map.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CapassComponent } from '../capass/capass.component';



@Component({
  selector: 'app-capas',
  templateUrl: './capas.component.html',
  styleUrls: ['./capas.component.css']
})
export class CapasComponent {
  @Input() capa!: Capa;
  constructor(private MapService: MapService,
              private SideBar: SidebarComponent,
              private Capass: CapassComponent) { }


  color: string = '#2889e9';
  arrayColors: any = {
    color1: '#2883e9',
    color2: '#e920e9',
    color3: 'rgb(255,245,0)',
    color4: 'rgb(236,64,64)',
    color5: 'rgba(45,208,45,1)'
  };
  selectedColor: string = 'color1';

  alternarCapa(alternar: HTMLInputElement, nombre: string, event: Event){
    //console.log (alternar.id, alternar.checked);
    event.stopPropagation();

    this.MapService.alternarCapa(nombre, alternar.checked);
  }

  transparencia(barra: HTMLInputElement){
   // console.log (barra.id, barra.value );
    this.MapService.cambiarTransparencia(barra.id,  barra.value );

  }

  cambiarColor(nuevoColor: string){
  

    this.color = nuevoColor; 
  
     this.MapService.cambiarColor(this.capa.nombre,  this.color, this.capa.tipo );
      
   }

   seleccionaColor(event: string){
   
    // this.color = nuevoColor; 
    // //  console.log ('datos de la capa', this.capa );
    //  this.MapService.seleccionaColor(this.capa.nombre,  this.color, this.capa.tipo );
   }

  quitarCapa(capa: string, event: Event){
    event.stopPropagation();
    this.MapService.quitarCapa(capa);
    this.SideBar.quitarCapa(this.capa);
    this.Capass.quitarCapa2(this.capa);
    //console.log(this.capa.nombre);
  }

  stopPropagation(event: Event){
    event.stopPropagation();
  }
}
