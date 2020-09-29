import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SunbirdPdfPlayerModule } from 'sunbird-pdf-player';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SunbirdPdfPlayerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
