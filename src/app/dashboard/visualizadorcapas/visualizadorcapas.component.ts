import { Component, OnInit } from '@angular/core';
//import { MapslibreComponent } from '../mapslibre/mapslibre.component';
import { CapasComponent } from '../capas/capas.component';
import { Capa } from '../capa';
import { MapService } from 'src/app/services/map.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-visualizadorcapas',
  templateUrl: './visualizadorcapas.component.html',
  styleUrls: ['./visualizadorcapas.component.css']
})
export class VisualizadorcapasComponent implements OnInit{
  isdisabled=false
  listacapas: Capa[] = [];

  constructor(private MapService: MapService, private AuthService: AuthService) { 
    
  }

  ngOnInit(): void {
    this.listacapas = this.MapService.getListaCapas();
  }

  

    agregaCapa(){
      this.isdisabled=true
      let datos=[];
       this.AuthService.getCapas(datos).subscribe((res: any) => {

          res.forEach((dato, index) => {
            // console.log(`Posición ${index}:`, dato);
            let tipoGeometria = 'line'; // Valor por defecto
            if (dato.type === 'MULTIPOLYGON') {
              tipoGeometria = 'fill';
            } else if (dato.type === 'POINT') {
              tipoGeometria = 'circle';
            } else if (dato.type === 'MULTILINESTRING') {
              tipoGeometria = 'line';
            }
            if(dato.estado!='Baja'){
              this.MapService.agregaCapaAutomatico(dato);
              this.MapService.agregaListaCapa({
                id: dato.id,
                nombre: dato.nombre,
                color: '#123456',
                visible: true,
                descripcion: dato.nombre,
                transparencia: 0.75,
                tipo: tipoGeometria
              } );
            }
            
          });
          // this.datos=res;
    });
    return
      //  this.MapService.agregaListaCapa({
      //     id: 0,
      //     nombre: 'Rutas Nacionales',
      //     color: '#123456',
      //     visible: true,
      //     descripcion: 'rutas_nacionales',
      //     transparencia: 0.75,
      //     tipo: 'line'
      //   } );

      // this.MapService.agregaListaCapa({
      //   id: 22,
      //   nombre: 'Rutas Prov Primaria',
      //   color: '#123456',
      //   visible: true,
      //   descripcion: 'rutas_prov_primaria',
      //   transparencia: 0.75,
      //   tipo: 'line'
      // }
      // );

      // this.MapService.agregaListaCapa({
      //   id: 22,
      //   nombre: 'Rutas Prov Secundaria',
      //   color: '#123456',
      //   visible: true,
      //   descripcion: 'rutas_prov_secundaria',
      //   transparencia: 0.75,
      //   tipo: 'line'
      // });
       
      // this.MapService.agregaListaCapa({
      //   id: 55,
      //   nombre: 'Puntosred',
      //   color: '#123456',
      //   visible: true,
      //   descripcion: 'Puntosred',
      //   transparencia: 1,
      //   tipo: 'circle'
      // });

      // this.MapService.agregaListaCapa({
      //   id: 44,
      //   nombre: 'Red de distribucion',
      //   color: '#123456',
      //   visible: true,
      //   descripcion: 'red',
      //   transparencia: 1,
      //   tipo: 'line'
      // });

      
      // this.MapService.agregaListaCapa({
      //   id: 7,
      //   nombre: 'Forestacion',
      //   color: '#333456',
      //   visible: true,
      //   descripcion: 'Forestacion',
      //   transparencia: 1,
      //   tipo: 'fill'
      // });

      // this.MapService.agregaListaCapa({
      //   id: 8,
      //   nombre: 'Bosques',
      //   color: '#333456',
      //   visible: true,
      //   descripcion: 'Bosques',
      //   transparencia: 1,
      //   tipo: 'fill'
      // });


    }

   quitarCapa2(capa: Capa){
      console.log('este es el que borra',capa);
      const index = this.listacapas.indexOf(capa, 0);
      if (index > -1) {
        this.listacapas.splice(index, 1);
      }
    }

   

}
