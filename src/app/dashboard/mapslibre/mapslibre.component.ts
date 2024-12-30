import { AfterViewInit, Component, OnInit } from '@angular/core';
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
  Feature
} from 'maplibre-gl';
import maplibregl from 'maplibre-gl';
import { MaplibreLegendControl } from "@watergis/maplibre-gl-legend";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import MeasuresControl from 'maplibre-gl-measures';
import ARLocale from './AR_locale';
import { MaplibreExportControl, Size, PageOrientation, Format, DPI } from '@watergis/maplibre-gl-export';
import { Control } from 'mapbox-gl';
import { ControlComponent } from '@maplibre/ngx-maplibre-gl';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Capa } from '../capa';
//import { CapassComponent } from '../capass/capass.component';


@Component({
  selector: 'app-mapslibre',
  templateUrl: './mapslibre.component.html',
  styleUrls: ['./mapslibre.component.css']
})
export class MapslibreComponent implements OnInit, AfterViewInit {
  nodos: any
  layerId = 'OSM';
  style: string | StyleSpecification = 'https://demotiles.maplibre.org/style.json';
  targets: any;
  form_WMS: FormGroup;

  constructor(
    private AuthService: AuthService,
    private MapService: MapService,
    private fromWMS: FormBuilder,
    //public Capass: CapassComponent
  ) {
    this.form_WMS = this.fromWMS.group({
      nombreWMS: ['vueLO'],
      URLWMS: ['https://imagenes.ign.gob.ar/geoserver/gwc/service/wms'],
      capaWMS: ['mosaicos_vuelos_vant']
    });
  }



  ngAfterViewInit() {
    this.changeStyle(this.layerId);
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

  ngOnInit(): void {
    this.getNodos();
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



  getNodos() {
    this.AuthService.getNodos().subscribe((res: any) => {
      //console.log('respuesta',res[0].row_to_json)
      // this.datos=res;
      this.nodos = res[0].row_to_json;

      const map = new maplibregl.Map({
        container: 'div-map',
        style: this.style, //'https://demotiles.maplibre.org/style.json', // stylesheet location
        center: [-53.67774734, -26.60424243], // starting position [lng, lat]
        zoom: 6.5, // starting zoom
        locale: ARLocale
      });

      var geocoder_api = {
        forwardGeocode: async (config: { query: string; }) => {
          const features: any = [];
          try {
            let request =
              'https://nominatim.openstreetmap.org/search?q=' +
              config.query +
              ',Argentina&format=geojson&polygon_geojson=1&addressdetails=1';
            const response = await fetch(request);
            const geojson = await response.json();
            for (let feature of geojson.features) {
              let center = [
                feature.bbox[0] +
                (feature.bbox[2] - feature.bbox[0]) / 2,
                feature.bbox[1] +
                (feature.bbox[3] - feature.bbox[1]) / 2
              ];
              let point = {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: center
                },
                place_name: feature.properties.display_name,
                properties: feature.properties,
                text: feature.properties.display_name,
                place_type: ['place'],
                center: center
              };
              features.push(point);
            }
          } catch (e) {
            console.error(`Fallé el forwardGeocode con el error: ${e}`);
          }

          return {
            features: features
          };
        },
        reverseGeocode: async (config: { query: string; }) => {
          const features: any = [];
          console.log(config.query);
          try {
            let request =
              'https://nominatim.openstreetmap.org/reverse?lat=' +
              config.query[1] +
              '&lon=' + config.query[0] + '&format=geojson&polygon_geojson=1&addressdetails=1';
            const response = await fetch(request);
            const geojson = await response.json();
            for (let feature of geojson.features) {
              let center = [
                feature.bbox[0] +
                (feature.bbox[2] - feature.bbox[0]) / 2,
                feature.bbox[1] +
                (feature.bbox[3] - feature.bbox[1]) / 2
              ];
              let point = {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: center
                },
                place_name: feature.properties.display_name,
                properties: feature.properties,
                text: feature.properties.display_name,
                place_type: ['place'],
                center: center
              };
              features.push(point);
            }
          } catch (e) {
            console.error(`Falló el  erverseGeocode con el error: ${e}`);
          }

          return {
            features: features
          };
        }
      };

      map.addControl(
        new MaplibreGeocoder(geocoder_api, {
          maplibregl: maplibregl,
          placeholder: 'Buscar...',
          limit: 3,
          popup: true,
          collapsed: true,
          reverseGeocode: true,
          types: 'address,poi,neighborhood,place'
        }), 'top-left'
      );

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
          lengthMeasurementButtonTitle: 'Medir dsitancia',
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
        // 'pipeline': 'Pipeline',
        // 'pipeline_annotation': 'Pipeline Label',
        // 'meter': 'Water Meter',
        // 'flow meter': 'Flow Meter',
        // 'valve': 'Valve',
        // 'firehydrant': 'Fire Hydrant',
        // 'washout': 'Washout',
        // 'tank': 'Tank',
        // 'tank_annotation': 'Tank Label',
        // 'wtp': 'WTP',
        // 'wtp_annotation': 'WTP Label',
        // 'intake': 'Intake',
        // 'intake_annotation': 'Intake Label',
        // 'parcels': 'Parcels',
        // 'parcels_annotation': 'Parcels Label',
        // 'village': 'Village',
        // 'village_annotation': 'Village Label',
        // 'dma': 'DMA',
        // 'dma_annotation': 'DMA Label',
        'Nodos': 'Nodos'
      };

      map.addControl(new MaplibreLegendControl(this.targets, {
        showDefault: false,
        showCheckbox: true,
        onlyRendered: false,
        reverseOrder: true,
        title: 'Referencias',
      }), 'top-left');
      document.getElementsByClassName('maplibregl-legend-onlyRendered-label')[0].textContent = 'Solo lo visible';

      //map.addControl( 'top-right');

      //   map.addControl(new MaplibreExportControl({
      //     PageSize: Size.A3,
      //     PageOrientation: PageOrientation.Portrait,
      //     Format: Format.PNG,
      //     DPI: DPI[96],
      //     Crosshair: true,
      //     PrintableArea: true,
      // }), 'top-right');

      map.on('load', function () {
        // AGREGAR FUENTES DE DATOS ///
        map.addSource('srclocalidades', {
          type: 'geojson',
          data: res[0].row_to_json
        });

        // AGREGAR CAPA CON LA FUENTE DE DATOS
        map.addLayer({
          'id': 'localidades',
          'type': 'circle',
          'source': 'srclocalidades',
          'paint': {
            'circle-radius': 6,
            'circle-color': '#B42222',
            'circle-opacity': 1
          },
          //'filter': ['==', 'feature.properties[2]', 'MUNICIPIO']
        });

        //layerIDs.push('localidades');

        //FUNCION PARA LOS POP UP
        map.on('click', 'localidades', function (e) {
          let coordinates: LngLatLike = [0, 0];
          let description: string = '';
          if (e.features != null) {
            if (e.features[0].geometry.type === 'Point') {
              coordinates[0] = e.features[0].geometry.coordinates[0];
              coordinates[1] = e.features[0].geometry.coordinates[1];
              if (e.features[0].properties != null) {
                description = 'Elevación ' + e.features[0].properties['elevation'] + '<br/>Demanda ' + e.features[0].properties['demand']
                  + '<br/>Presión ' + e.features[0].properties['result_pre'];
              }
            }
          }
          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          if (coordinates != null) {
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
          }

          new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(map);
        });

        // Change the cursor to a pointer when the mouse is over the localidades layer.
        map.on('mouseenter', 'localidades', function () {
          map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'localidades', function () {
          map.getCanvas().style.cursor = '';
        });

        /* const capasdiv = document.createElement('div');
        capasdiv.innerHTML= '<button onclick="agregaCapa()" type="button" class="btn btn-default">'+
        '<i class="fas fa-layer-group"></i><span class="maplibregl-ctrl-icon mapboxgl-ctrl-icon" aria-hidden="true"></span>'+
        '</button>'; */

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
            todos.style.display = "block";
          }
        });
        const listaDeCapasButton = document.getElementsByClassName('capas-item-close-button')[0];
        listaDeCapasButton.addEventListener("click", () => {
          listaCapasButton.style.display = "block";
          let todos = document.getElementsByClassName('capas-item')[0] as HTMLDivElement | null;
          if (todos) {
            todos.style.display = "none";
          }
        })

        const capasdiv = document.getElementsByClassName('capas-item')[0] as HTMLDivElement | null;

        // EJEMPLO DE LISTA DE CAPAS SWITCHEABLE
        //<button class="maplibregl-ctrl-icon maplibregl-legend-switcher" style="display: block;"></button>
        //<div class="maplibregl-legend-list" style="display: none;">
        //<button class="maplibregl-legend-close-button">x</button>
        //<label class="maplibregl-legend-title-label">Referencias</label>
        //<br><input type="checkbox" id="maplibregl-legend-onlyrendered-checkbox-60.697991430091356" class="maplibregl-legend-onlyRendered-checkbox">
        //<label class="maplibregl-legend-onlyRendered-label" for="maplibregl-legend-onlyrendered-checkbox-60.697991430091356">Solo lo visible</label>
        //<br><table class="legend-table"><tr>
        //<td class="legend-table-td"><input type="checkbox" name="localidades" value="localidades"></td>
        //<td class="legend-table-td"><svg version="1.1" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="[object Object]"><g><circle key="l1" cx="10" cy="10" fill="#B42222" opacity="1" r="6"></circle><circle key="l2" cx="10" cy="10" fill="transparent" opacity="1" r="6" stroke-width="0" stroke="#000000"></circle></g><g><circle key="l1" cx="10" cy="10" fill="#B42222" opacity="1" r="6"></circle><circle key="l2" cx="10" cy="10" fill="transparent" opacity="1" r="6" stroke-width="0" stroke="#000000"></circle></g><g><circle key="l1" cx="10" cy="10" fill="#B42222" opacity="1" r="6"></circle><circle key="l2" cx="10" cy="10" fill="transparent" opacity="1" r="6" stroke-width="0" stroke="#000000"></circle></g></svg></td>
        //<td class="legend-table-td"><label>Nodos</label></td>
        //</tr></table></div>

        capasdiv!.setAttribute('class', 'capas-item maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group'); //maplibregl-ctrl
        let ctrldiv = document.getElementsByClassName('maplibregl-ctrl-top-right');
        ctrldiv[0].append(listaCapasButton);
        ctrldiv[0].append(capasdiv!);

      }); //  este es el onload
      //console.log (map);
      this.MapService.setMap(map);
      this.MapService.setLeyendas(this.targets);



    });

  }
}


