import { AuthService } from './../../services/auth.service';
//import { Map, Marker } from 'mapbox-gl';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
//import { map } from 'rxjs';
import { RasterLayerSpecification,
  RasterSourceSpecification,
  StyleSpecification,
  MapLayerMouseEvent,
  LngLat } from 'maplibre-gl';
//import { GeoJsonProperties } from 'geojson';
//import { features } from 'process';
// import { MaplibreLegendControl } from "@watergis/maplibre-gl-legend";
import { MapComponent } from '@maplibre/ngx-maplibre-gl';

@Component({
  selector: 'app-maps-view',
  templateUrl: './maps-view.component.html',
  styleUrls: ['./maps-view.component.css']
})

export class MapsViewComponent implements AfterViewInit {
// @ViewChild('div-map')
// mapDivElement?: ElementRef
nodos:any
candidatos:any
agrupaciones:any
filtros:any
form_busqueda: FormGroup;

cursorStyle: string='';
layerId = 'code';
style: string | StyleSpecification;

  constructor(
    private AuthService: AuthService,
    private fb: FormBuilder
  ) {
    this.form_busqueda = this.fb.group({
      fecha_desde: [''],
      fecha_hasta: [''],
      id_circuito_filtro: [''],
      id_candidato_filtro: [''],
      id_agrupacion_filtro: [''],

    });

    this.style ="";
    this.getNodos();
   }

  ngAfterViewInit(): void {
   // const map = new MapComponent
    // const map = new Map({
    //   container: 'div-map', // container ID
    //   style: 'mapbox://styles/mapbox/streets-v12', // style URL
    //   center: [-55.938381, -27.436621], // starting position [lng, lat]
    //   zoom: 13, // starting zoom
    //   })


      // new Marker({
      //   color:'orange'
      // }).setLngLat([-55.8929942, -27.3570255])
      // .addTo(map)

      // this.AuthService.getAgendas(this.filtros).subscribe((res: any) => {
      //   this.datos=res;
      //   for (let value of this.datos) {
      //       var arregloDeTerminos = value.ubicacion.split(',');

      //      console.log('ubicacion->',arregloDeTerminos[0]);
      //      new Marker({
      //        color:'orange'
      //      }).setLngLat([arregloDeTerminos[1], arregloDeTerminos[0]])
      //      .addTo(map)
      //     }
      // });


  }

  changeStyle(layerId: string) {
    if (layerId === 'streets') {

      this.style = 'https://demotiles.maplibre.org/style.json';
    } else {

      const source = {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        minzoom: 0,
        maxzoom: 15,
        scheme: 'xyz',
        tileSize: 256,
      } as RasterSourceSpecification;
      const layer = {
        id: 'some-raster-layer-id',
        type: 'raster',
        source: 'raster',
        layout: {
          visibility: 'visible',
        },
        paint: {
          'raster-opacity': 1.0,
        },
      } as RasterLayerSpecification;

      this.style = {
        version: 8,
        sources: {
          raster: source,
        },
        layers: [layer],
      };
    }
    //console.log('capa->',this.style);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.



   // this.getCandidatos()
   // this.getAgrupaciones()
   this.changeStyle(this.layerId);
  }

   getNodos() {
    this.AuthService.getNodos().subscribe((res: any) => {
      this.nodos=res[0].row_to_json;
      // const map = new Map({
      //   container: 'div-map', // container ID
      //   style: 'mapbox://styles/mapbox/streets-v12', // style URL
      //   center: [-55.938381, -27.436621], // starting position [lng, lat]
      //   zoom: 11, // starting zoom
      //   })
        // for (let value of this.datos) {
        //   if(value.ubicacion){
        //     var arregloDeTerminos = value.ubicacion.split(',');

        //     console.log('ubicacion->',arregloDeTerminos[0]);
        //     new Marker({
        //       color:'orange'
        //     }).setLngLat([arregloDeTerminos[1], arregloDeTerminos[0]])
        //     .addTo(map)
        //   }

        // }
    });
  }



  busqueda(){
    this.filtros = {
      id_circuito_filtro: this.form_busqueda.value.id_circuito_filtro,
      fecha_desde: this.form_busqueda.value.fecha_desde,
      fecha_hasta: this.form_busqueda.value.fecha_hasta,
      id_candidato_filtro: this.form_busqueda.value.id_candidato_filtro,
      id_agrupacion_filtro: this.form_busqueda.value.id_agrupacion_filtro,
    };
    console.log(this.filtros)
    //this.getAgendas(this.filtros);

  }
}
