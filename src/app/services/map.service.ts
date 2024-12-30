import { Injectable } from '@angular/core';
import { StyleExpression } from '@maplibre/maplibre-gl-style-spec';
import { AuthService } from 'src/app/services/auth.service';
import { Capa } from '../dashboard/capa';
import maplibregl, { LngLatLike, Map, RasterSourceSpecification, SourceSpecification, Style, StyleSpecification, TileBounds, VectorSourceSpecification } from 'maplibre-gl';
import { event } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private AuthService: AuthService) {}

  private map?: Map;
  private leyendas: any;
  private listacapas2: Capa[] = [
  ];


  get isMapReady(){
    return !!this.map;
  }

setMap(map: Map){
  this.map = map;
}

getLeyendas(){
  return this.leyendas;
}

setLeyendas(leyendas: any){
  this.leyendas = leyendas;
}

getListaCapas(){
  return this.listacapas2;
}

async setStyle( style: StyleSpecification | string){
  if ( !this.isMapReady) throw Error('El Mapa no esta listo');

  const response = await fetch(
    'https://demotiles.maplibre.org/style.json'
  );
  const responseJson = await response.json();
  const newStyle = responseJson;

  //console.log (this.map?.getStyle());
  let currLayers = this.map?.getStyle().layers;
  let currSources = this.map?.getStyle().sources;
  if (currLayers) {
    const filteredLayers = currLayers.filter((l: any) => { return(l?.source != 'maplibre')});
    //console.log(filteredLayers);
     // ensure any sources from the current style are copied across to the new style
     newStyle.sources = Object.assign({},
      this.map?.getStyle().sources,
      newStyle.sources
  );
    newStyle.layers = [
    ...newStyle.layers,
    ...filteredLayers,
  ];
  }
  this.map?.setStyle(newStyle, {diff: true, validate: false});
  //console.log (this.map?.getStyle());
}

setStyle2( style: string, scheme: string){
  if ( !this.isMapReady) throw Error('El Mapa no esta listo');
  let nuevo_style: StyleSpecification | undefined;
  let orig_style: StyleSpecification | undefined = this.map?.getStyle();
  if (orig_style){
    if (orig_style.name = 'Terceros'){
      let orig_raster: any = orig_style.sources['raster'];
     // if (typeof orig_raster === 'string'){
     //   console.log(1 , orig_raster);
     // } else {
        orig_raster.tiles = [style];
        orig_raster.scheme = scheme;
        orig_style.sources['raster'] = orig_raster;
      //}
    } else {
     // console.log('Entra aca y no se que debería hacer');
// TODO: HACER OTRA COSA CUANDO ES EL DE MAPLIBRE.-
    }
  }
  if (orig_style){
    this.map?.setStyle(orig_style);
  }
  //console.log (this.map?.getStyle());
}

 getMap( ){
   if ( !this.isMapReady) throw Error('El Mapa no esta listo para GETEARLO');
   return this.map;
 }

 agregaListaCapa(detalleCapa: Capa){
  this.listacapas2.push(detalleCapa);
};

 agregaCapaWMS(nombrecapa: string, URL:string, layer:string){
  if ( !this.isMapReady) throw Error('El Mapa no esta listo para agregar WMSs');
    this.map?.addSource('src'+nombrecapa, {
    'type': 'raster',
    // ejemplo 'https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015'
    'tiles': [
    URL+'?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers='+layer
    ],
    'tileSize': 256
    });
    this.map?.addLayer({
      'id': nombrecapa,
      'type': 'raster',
      'source': 'src'+nombrecapa,
      'paint': {}
    }
    );
 }  //coberturas_del_suelo:cobertura_suelo

 agregaCapaPunto(nombrecapa: string, datos: any, atributos:string[] ){
  if ( !this.isMapReady) throw Error('El Mapa no esta listo para agregar capa punto');

  // GENERAR UN COLOR AL AZAR
  let rndcolor = this.generarColor();

  //AGREGAR LA FUNTE DE DATOS A MOSTRAR
  this.map?.addSource('src'+nombrecapa, {
    type: 'geojson',
    data: datos
  });

  // AGREGAR CAPA CON LA FUENTE DE DATOS
  this.map?.addLayer({
    'id': nombrecapa,
    'type': 'circle',
    'source': 'src'+nombrecapa,
    'paint': {
    'circle-radius': 5,
    'circle-color': rndcolor,
    'circle-opacity': 1
    },
    //'filter': ['==', 'feature.properties[2]', 'MUNICIPIO']
    });

  //layerIDs.push('localidades');

  //AGREGA POPUP A LA CAPA --- VER SI DEBE PONERSE ALGUN CONDICIONAL
  this.agregarPopUp(nombrecapa, atributos);

 }  /// TERMINA AGREGAR CAPA-PUNTO

 agregaCapaLinea(nombrecapa: string, datos: any, atributos:string[] ){
  if ( !this.isMapReady) throw Error('El Mapa no esta listo para agregar un capa linea');

  // GENERAR UN COLOR AL AZAR
  let rndcolor = this.generarColor();

  //AGREGAR LA FUNTE DE DATOS A MOSTRAR
  this.map?.addSource('src'+nombrecapa, {
    type: 'geojson',
    data: datos
  });

  // AGREGAR CAPA CON LA FUENTE DE DATOS
  this.map?.addLayer({
    'id': nombrecapa,
    'type': 'line',
    'source': 'src'+nombrecapa,
    'paint': {
    'line-width': 5,
    'line-color': rndcolor,
    'line-opacity': 1
    },
    //'filter': ['==', 'feature.properties[2]', 'MUNICIPIO']
    });

  //AGREGA POPUP A LA CAPA --- VER SI DEBE PONERSE ALGUN CONDICIONAL
  this.agregarPopUp(nombrecapa, atributos);

 }  /// TERMINA AGREGAR CAPA-LINEA

 agregaCapaPolig(nombrecapa: string, datos: any, atributos:string[] ){
  if ( !this.isMapReady) throw Error('El Mapa no esta listo para agregar una capa de poligonos');

  // GENERAR UN COLOR AL AZAR
  let rndcolor = this.generarColor();

  //AGREGAR LA FUNTE DE DATOS A MOSTRAR
  this.map?.addSource('src'+nombrecapa, {
    type: 'geojson',
    data: datos
  });

  // AGREGAR CAPA CON LA FUENTE DE DATOS
  this.map?.addLayer({
    'id': nombrecapa,
    'type': 'fill',
    'source': 'src'+nombrecapa,
    'paint': {
    'fill-color': rndcolor,
    'fill-opacity': 1
    },
    //'filter': ['==', 'feature.properties[2]', 'MUNICIPIO']
    });

  //layerIDs.push('localidades');

  //AGREGA POPUP A LA CAPA --- VER SI DEBE PONERSE ALGUN CONDICIONAL
  this.agregarPopUp(nombrecapa, atributos);

 }  /// TERMINA AGREGAR CAPA-POLIGONO

 alternarCapa(idcapa: string, visible: boolean){
  this.map?.setLayoutProperty(idcapa, 'visibility', visible ? 'visible' : 'none')
 }

 cambiarTransparencia(idcapa: string, valor: string){
  //console.log(idcapa, parseFloat(valor));
  let tipo = this.map?.getLayer(idcapa).type;
  this.map?.setPaintProperty(idcapa, tipo+'-opacity', parseFloat(valor));    //// TESTEAR ESTA MANERA EN VEZ DE LOS IFs  ////
  
 }


 cambiarColor(idcapa: string, valor: string, tipo:any){
  // console.log(`Changing color of layer: ${idcapa}, value: ${valor}, type: ${tipo}`);
  // console.log(this.map?.getStyle().layers);
  try {
    if (this.map?.getLayer(idcapa)) {
      // print all existing layers
      
      this.map?.setPaintProperty(idcapa, tipo+'-color', valor, {validate: false});
      // console.log(`Color changed successfully for layer: ${idcapa}`);
    } 
  } catch (error) {
    // console.error(`Error changing color for layer: ${idcapa}, error: ${error}`);
  }

  //this.map?.setPaintProperty(idcapa,'circle-color', valor);
 }

 seleccionaColor(idcapa: string, valor: string, tipo:any){
  
  this.map?.setPaintProperty(idcapa, tipo+'-color', valor);

 //this.map?.setPaintProperty(idcapa,'circle-color', valor);
}

 quitarCapa(idcapa: string){
  const datoAEliminar = idcapa; // Reemplaza con el dato que tienes

  this.map?.removeLayer(idcapa);
  this.map?.removeSource('src'+idcapa);
  const indice = this.listacapas2.findIndex((item:any) => item.nombre === datoAEliminar);

  if (indice !== -1) {
    this.listacapas2.splice(indice, 1);
  } 
 }

 generarColor(): string{
  // GENERAR UN COLOR AL AZAR
  const letters = '0123456789ABCDEF';
  let rndcolor = '#';
  for (var i = 0; i < 6; i++) {
    rndcolor += letters[Math.floor(Math.random() * 16)];
  }
  return rndcolor;
 }

 agregarPopUp(nombrecapa: string, atributos: string[]){
   //FUNCION PARA LOS POP UP
   this.map?.on('click', nombrecapa,  (e) => {
   
    let coordinates: LngLatLike = [0,0];
    let description: string = '';
    if (e.features != null){
      
      if(e.features[0].geometry.type === 'Point'){
        coordinates[0] = e.features[0].geometry.coordinates[0];
        coordinates[1] = e.features[0].geometry.coordinates[1];
        if (e.features[0].properties != null){
          description += '<strong>'+nombrecapa+'</strong><br/>'
          atributos.forEach(atributo => {
            
            if (e.features != null){
              if (e.features[0].properties![atributo]) {
                let cadena: string = e.features[0].properties![atributo].toString();
                
                if (cadena.includes("jpg")) {
                    description += atributo + '<br/><img width="300" alt="No se encuentra la imagen" src="' + e.features[0].properties![atributo] + '"><br/>';
                } else {
                    description += atributo + ': ' + e.features[0].properties![atributo] + '<br/>';
                }
                
            }
            
            }
          })

        }
      } else if (e.features[0].geometry.type === 'LineString' || e.features[0].geometry.type === 'Polygon') {
        
        coordinates[0] = e.lngLat.lng;
        coordinates[1] = e.lngLat.lat;
        if (e.features[0].properties != null){
          description += '<strong>'+nombrecapa+'</strong><br/>'
          atributos.forEach(atributo => {
            if (e.features != null){
              if (e.features[0].properties![atributo]){
                description += atributo.toUpperCase() + ': ' +  e.features[0].properties![atributo] + '<br/>';
                  }
                  if (atributo === 'source') {
                    description += '<br/><button class="btn btn-secundary negro" onclick="handleSourceClick(' +  e.features[0].properties![atributo] + ')">Ver Cortes</button><br/>';
                }
            }
          })
                /////// MEJORARA ESTA FUNCION    ////////
        }
      }
    }
  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  if (coordinates != null){
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
  }

  new maplibregl.Popup()
  .setLngLat(coordinates)
  .setHTML(description)
  .addTo(e.target);
  });

  // Cambia el cursor a "dedito" cuando el mouse para sobre un objeto de la capa.
  this.map?.on('mouseenter', nombrecapa, () => {
  this.map!.getCanvas().style.cursor = 'pointer';
  });

  // Lo cambia nuevamente a "manito" cuando sale del objeto.
  this.map?.on('mouseleave', nombrecapa,  () => {
  this.map!.getCanvas().style.cursor = '';
  });
}

agregaCapaCORTE(to_json, doruce){
  let datos: any;
  let rutas = ['Corte'+doruce,'id','diametro', 'material', 'fecha', 'profundida', 'longitud'];

    datos = to_json;
    let nombrecapa = rutas.shift()!;
    let pk = rutas.shift();
    this.agregaCapaLinea('Corte'+doruce,datos,rutas);
    this.leyendas.nombrecapa = 'Corte'+doruce;
}
agregaCapaAutomatico(capa:any){
  
  let datos: any;
  console.log(capa.atributos)
  let datos_capa = [capa.nombre,...capa.atributos];
  this.AuthService.getCapa(datos_capa).subscribe((res: any) => {
    datos = res[0].row_to_json;
    // console.log(capa)
    let nombrecapa = datos_capa.shift();
    let pk = datos_capa.shift();
    let tipoGeometria = 'line'; // Valor por defecto
            if (capa.type === 'MULTIPOLYGON') {
              this.agregaCapaPolig(capa.nombre,datos,datos_capa);
            } else if (capa.type === 'POINT') {
              this.agregaCapaPunto(capa.nombre,datos,datos_capa);
            } else if (capa.type === 'MULTILINESTRING') {
              this.agregaCapaLinea(capa.nombre,datos,datos_capa);
            }
    // this.agregaCapaLinea(capa.nombre,datos,datos_capa);
    this.leyendas.red = capa.nombre;
  });
}
agregaCapaDemo(){
  let datos: any;
  let red = ['red','id','tipo', 'comentario', 'diametro', 'material', 'fecha', 'profundida', 'longitud', 'source'];
  this.AuthService.getCapa(red).subscribe((res: any) => {
    datos = res[0].row_to_json;
    let nombrecapa = red.shift();
    let pk = red.shift();
    this.agregaCapaLinea('Red de distribucion',datos,red);
    this.leyendas.red = 'Red de distribucion';
  });


  let rutas = ['rutas_nacionales','id','codigo', 'caracteris'];
  this.AuthService.getCapa(rutas).subscribe((res: any) => {
    datos = res[0].row_to_json;
    let nombrecapa = rutas.shift()!;
    let pk = rutas.shift();
    this.agregaCapaLinea('Rutas Nacionales',datos,rutas);
    this.leyendas.nombrecapa = 'Rutas Nacionales';
    
  });

  let rutas_prov_primaria = ['rutas_prov_primaria','id','codigo', 'caracteris'];
  this.AuthService.getCapa(rutas_prov_primaria).subscribe((res: any) => {
    datos = res[0].row_to_json;
    let nombrecapa = rutas_prov_primaria.shift()!;
    let pk = rutas_prov_primaria.shift();
    this.agregaCapaLinea('Rutas Prov Primaria',datos,rutas_prov_primaria);
    this.leyendas.nombrecapa = 'Rutas  Prov Primaria';
    
  });
  
  let rutas_prov_secundaria = ['rutas_prov_secundaria','id','codigo', 'caracteris'];
  this.AuthService.getCapa(rutas_prov_secundaria).subscribe((res: any) => {
    datos = res[0].row_to_json;
    let nombrecapa = rutas_prov_secundaria.shift()!;
    let pk = rutas_prov_secundaria.shift();
    this.agregaCapaLinea('Rutas Prov Secundaria',datos,rutas_prov_secundaria);
    this.leyendas.nombrecapa = 'Rutas Prov Secundaria';
    
  });

  let forestacion_rec_demo = ['forestacion_rec_demo','id','superficie', 'especie'];
  this.AuthService.getCapa(forestacion_rec_demo).subscribe((res: any) => {
    datos = res[0].row_to_json;
    let nombrecapa = forestacion_rec_demo.shift();
    let pk = forestacion_rec_demo.shift();
    this.agregaCapaPolig('Forestacion',datos,forestacion_rec_demo);
    this.leyendas.forestacion_rec_demo = 'Forestacion';
  });

  

  

  let puntos = ['puntos_red','id','Tipo'];
  this.AuthService.getCapa(puntos).subscribe((res: any) => {
    
    datos = res[0].row_to_json;
    let nombrecapa = puntos.shift();
    let pk = puntos.shift();
    this.agregaCapaPunto('Puntosred',datos,puntos);
    this.leyendas.puntos = 'Puntosred';
  });
}


}
