import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  console.log = function(){
    
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('ngsw-worker.js')
      .then(() => console.log('service worker installed'))
      .catch(err => console.error('Error', err));
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
