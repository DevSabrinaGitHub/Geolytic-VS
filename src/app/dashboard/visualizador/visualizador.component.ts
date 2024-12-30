import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MapService } from 'src/app/services/map.service';
import {
  RasterLayerSpecification,
  RasterSourceSpecification,
  StyleSpecification,
  MapLayerMouseEvent,
  LngLat,
  LngLatLike,
  AttributionControl,
  Feature,
  Map
} from 'maplibre-gl';
import maplibregl from 'maplibre-gl';
import { MaplibreLegendControl } from "@watergis/maplibre-gl-legend";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import MeasuresControl from 'maplibre-gl-measures';
import ARLocale from './AR_locale';
import { MaplibreExportControl, Size, PageOrientation, Format, DPI } from '@watergis/maplibre-gl-export';
import { ControlComponent } from '@maplibre/ngx-maplibre-gl';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Capa } from '../capa';

declare var bootstrap: any;

@Component({
  selector: 'app-visualizador',
  templateUrl: './visualizador.component.html',
  styleUrls: ['./visualizador.component.css']
})
export class VisualizadorComponent implements OnInit, AfterViewInit {
  nodos: any
  leyendas: any;
  layerId = 'OSM';
  style: string | StyleSpecification = 'https://demotiles.maplibre.org/style.json';
  targets: any;
  form_WMS: FormGroup;
  rol = localStorage.getItem('rol');
  
  @ViewChild('DetalleModal') detalleModal!: ElementRef;
  geojsonData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "id": 11,
          "tipo": "DISTRIBUCION",
          "diametro": 32,
          "material": "MANGUERA PEAD",
          "fecha": "2024-04-23",
          "profundida": 1,
          "longitud": 287.85,
          "comentario": null,
          "d interno": 32,
          "texto": null,
          "elevacion": null,
          "d int": null,
          "layer": "C_BOMBA IMAS SAN ALBERTO"
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [[-55.002081309, -26.837112237], [-55.001861106, -26.834521849]]
        }
      },
      // Más objetos "Feature" aquí
    ]
  };
  featuresArray: any[] = [];
  constructor(
    private AuthService: AuthService,
    private MapService: MapService,
    private fromWMS: FormBuilder,
  ) {
    (window as any).handleSourceClick = this.handleSourceClick.bind(this);
    this.form_WMS = this.fromWMS.group({
      nombreWMS: ['vueLO'],
      URLWMS: ['https://imagenes.ign.gob.ar/geoserver/gwc/service/wms'],
      capaWMS: ['mosaicos_vuelos_vant']
    });
  }


  handleSourceClick(value:any) {
    const modalElement = document.getElementById('DetalleModal');
    this.getSource(value);
    // if (modalElement) {

    //   const modal = new bootstrap.Modal(modalElement);
    //   modal.show();
    // } 
    // Aquí puedes agregar la lógica que necesites al presionar el botón
  }
  ngAfterViewInit() {
    this.changeStyle(this.layerId);
  }
  
  async ngOnInit(){
    // this.convertJsonToArray();
   await this.getVisualizador();
  }
  
  changeStyle(layerId: string) {
    let tiles: string = "";
    let scheme: string = "xyz";

    if (layerId === 'streets') {

      this.style = 'https://demotiles.maplibre.org/style.json';
      this.MapService.setStyle(this.style);
    } else {

      if (layerId === 'OSM') { tiles = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' };
      if (layerId === 'argenmap') { tiles = 'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{y}.png'; scheme = 'tms'; };
      if (layerId === 'argenmapgris') { tiles = 'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_gris@EPSG%3A3857@png/{z}/{x}/{y}.png'; scheme = 'tms'; };
      if (layerId === 'argenmaposcuro') { tiles = 'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/argenmap_oscuro@EPSG%3A3857@png/{z}/{x}/{y}.png'; scheme = 'tms'; };
      if (layerId === 'argenmaptopo') { tiles = 'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/mapabase_topo@EPSG%3A3857@png/{z}/{x}/{y}.png'; scheme = 'tms'; };
      if (layerId === 'watermark') { tiles = 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg' };
      if (layerId === 'arcgis') { tiles = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}' };
      if (layerId === 'GSatelite') { tiles = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' };

      const source = {
        type: 'raster',
        tiles: [tiles],//['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        minzoom: 0,
        maxzoom: 19,
        scheme: scheme,
        tileSize: 256,
      } as RasterSourceSpecification;
      const layer = {
        id: 'Bases',
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
        name: 'Terceros',
        sprite: 'https://demotiles.maplibre.org/styles/osm-bright-gl-style/sprite',
        glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
        sources: {
          raster: source,
        },
        layers: [layer],
      };
    }
    if (!this.MapService.isMapReady) throw Error('No hay mapa');

    this.MapService.setStyle2(tiles, scheme);
  }

  agregaCapaWMS(nombrecapa: string, URL: string, layer: string) {
    this.MapService.agregaCapaWMS(nombrecapa, URL, layer);
    
    Object.defineProperty(this.targets, nombrecapa, {
      value: nombrecapa, enumerable: true,
      configurable: true
    });
    //console.log(this.targets);
    let datosWMS = {
      id: 2,
      nombre: this.form_WMS.value.nombreWMS,
      color: '',
      visible: true,
      descripcion: 'warawara',
      transparencia: 0.75,
      tipo: 'raster'
    };

    this.MapService.agregaListaCapa(datosWMS);

  }

  pasaCapaWMS() {      ////   ESTO VIENE DEL SIDEBAR
    this.agregaCapaWMS(this.form_WMS.value.nombreWMS, this.form_WMS.value.URLWMS, this.form_WMS.value.capaWMS);
  }

  async getSource(source) {
    this.AuthService.getSource(source).subscribe((res: any) => {
      this.MapService.agregaCapaCORTE(res[0].row_to_json, source);
      this.MapService.agregaListaCapa({
        id: source,
        nombre: 'Corte'+source,
        color: '#123456',
        visible: true,
        descripcion: 'Corte'+source,
        transparencia: 0.75,
        tipo: 'line'
      } );
    })
  }
  
async getVisualizador() {
    this.AuthService.getNodos().subscribe((res: any) => {
      
      // this.nodos = res[0].row_to_json;

      const map = new maplibregl.Map({
        container: 'div-map',
        style: this.style, //'https://demotiles.maplibre.org/style.json', // stylesheet location
        center: [-53.67774734, -26.60424243], // starting position [lng, lat]
        zoom: 7.5, // starting zoom
        locale: ARLocale
      });

      map.addControl(new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }), 'top-left');

      map.addControl(new maplibregl.NavigationControl({
        visualizePitch: true
      }), 'top-left');

      map.addControl(new AttributionControl({
      }));

      var scale = new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      });
      map.addControl(scale);

      //scale.setUnit('metric');

      map.addControl(new maplibregl.FullscreenControl({}));

      const measure_opt = {
        lang: {
          areaMeasurementButtonTitle: 'Medir area',
          lengthMeasurementButtonTitle: 'Medir distancia',
          clearMeasurementsButtonTitle: 'Borrar mediciones',
        },
        units: 'metric', //or metric, the default
        style: {
          text: {
            radialOffset: 0.9,
            letterSpacing: 0.05,
            color: '#000000',//'#D20C0C',
            haloColor: '#fff',
            haloWidth: 1.5,
          },
          common: {
            midPointRadius: 3,
            midPointColor: '#D20C0C',
            midPointHaloRadius: 5,
            midPointHaloColor: '#FFF',
          },
          areaMeasurement: {
            fillColor: '#D20C0C',
            fillOutlineColor: '#D20C0C',
            fillOpacity: 0.01,
            lineWidth: 2,
          },
          lengthMeasurement: {
            lineWidth: 2,
            lineColor: "#D20C0C",
          },
        }
      };

      const ctrlMedir = new MeasuresControl(measure_opt);
      map.addControl(ctrlMedir, "top-left");
// controles para imprimir 
      const ctrlImprimir = new MaplibreExportControl({
        PageSize: Size.A4,
        PageOrientation: PageOrientation.Portrait,
        Format: Format.PNG,
        DPI: DPI[96],
        Crosshair: true,
        PrintableArea: true,
        Local: 'es'
      });

      map.addControl(
        ctrlImprimir,
        'top-left'
      );

      this.targets = {
        // 'Nodos': 'Nodos'
      };

      map.on('load', function () {
      
        map.addLayer({
          'id': 'localidades',
          'type': 'circle',
          'source': 'srclocalidades',
          'paint': {
            'circle-radius': 6,
            'circle-color': '#B42222',
            'circle-opacity': 1
          },

        });

        // FUNCION PARA LOS POP UP
       
        map.on('click', 'localidades', function (e) {
          
        });

      
        // CREA EL BOTON COMO PARTE DE LOS CONTROLES PARA TOGGLEAR LA LISTA DE CAPAS Y LO AGREGA AL MAPA
        const listaCapasButton = document.createElement("button");
        listaCapasButton.classList.add("maplibregl-ctrl-icon");
        listaCapasButton.classList.add("mapboxgl-ctrl-icon");
        listaCapasButton.classList.add("maplibregl-ctrl-group");
        listaCapasButton.classList.add("maplibregl-ctrl");
        listaCapasButton.classList.add("mapboxgl-ctrl-group");
        listaCapasButton.innerHTML = '<i class="fas fa-layer-group"></i><span class="maplibregl-ctrl-icon mapboxgl-ctrl-icon" aria-hidden="true"></span>';
        listaCapasButton.addEventListener("click", () => {
          listaCapasButton.style.display = "none";
          let todos = document.getElementsByClassName('capas-item')[0] as HTMLDivElement | null;
          if (todos) {
            todos.style.display = "inline-table";
          }
        });
        const listaDeCapasButton = document.getElementsByClassName('capas-item-close-button')[0];
        listaDeCapasButton.addEventListener("click", () => {
          listaCapasButton.style.display = "inline-table";
          let todos = document.getElementsByClassName('capas-item')[0] as HTMLDivElement | null;
          if (todos) {
            todos.style.display = "none";
          }
        })

        const capasdiv = document.getElementsByClassName('capas-item')[0] as HTMLDivElement | null;


        capasdiv!.setAttribute('class', 'capas-item maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group'); //maplibregl-ctrl
        let ctrldiv = document.getElementsByClassName('maplibregl-ctrl-top-right');
        ctrldiv[0].append(listaCapasButton);
        ctrldiv[0].append(capasdiv!);

      }); 
      //console.log (map);
      this.MapService.setMap(map);
      this.MapService.setLeyendas(this.targets);



    });

  }

}


