import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

//////////mapbox
//import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

//Mapboxgl.accessToken = 'pk.eyJ1IjoianBvbmNlMTQxMiIsImEiOiJjbGZwaXBmM2Uwd2QyM3FwdGo4ejE2Yml2In0.BmiVDge_-u-4QhmDF4R9Mg';


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
