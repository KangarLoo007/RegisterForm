import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule,RegisterModule } from './app.module';
//import { RegisterModule } from './app/pages/register/register.component';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


