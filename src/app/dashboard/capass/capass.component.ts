import { Component, OnInit } from '@angular/core';
//import { MapslibreComponent } from '../mapslibre/mapslibre.component';
import { CapasComponent } from '../capas/capas.component';
import { Capa } from '../capa';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-capass',
  templateUrl: './capass.component.html',
  styleUrls: ['./capass.component.css']
})
export class CapassComponent implements OnInit{

  listacapas: Capa[] = [];

  constructor(private MapService: MapService,) { }

  ngOnInit(): void {
    this.listacapas = this.MapService.getListaCapas();
  }


    agregaCapa2(){
       this.MapService.agregaCapaDemo();
      //this.listacapas2.push(
        this.MapService.agregaListaCapa({
        id: 0,
        nombre: 'Rutas Nacionales',
        color: '#123456',
        visible: true,
        descripcion: 'rutas_nacionales',
        transparencia: 0.75,
        tipo: 'line'
      }
      );
       
      //this.listacapas2.push(
        this.MapService.agregaListaCapa({
        id: 3,
        nombre: 'localidades_rec_demo',
        color: '#123456',
        visible: true,
        descripcion: 'localidades_rec_demo',
        transparencia: 1,
        tipo: 'circle'
      });
      
      
      //console.log(this.listacapas2);
    }

   quitarCapa2(capa: Capa){
      //console.log(idcapa);
      const index = this.listacapas.indexOf(capa, 0);
      if (index > -1) {
        this.listacapas.splice(index, 1);
      }
    }

}
