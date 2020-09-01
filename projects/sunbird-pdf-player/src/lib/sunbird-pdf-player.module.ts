import { NgModule } from '@angular/core';
import { SunbirdPdfPlayerComponent } from './sunbird-pdf-player.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  declarations: [SunbirdPdfPlayerComponent],
  imports: [
    NgxExtendedPdfViewerModule
  ],
  exports: [SunbirdPdfPlayerComponent]
})
export class SunbirdPdfPlayerModule { }
