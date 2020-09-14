import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { SunbirdPdfPlayerComponent } from './sunbird-pdf-player.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { HeaderComponent } from './header/header.component';
@NgModule({
  declarations: [SunbirdPdfPlayerComponent, HeaderComponent],
  imports: [
    NgxExtendedPdfViewerModule, FormsModule
  ],
  exports: [SunbirdPdfPlayerComponent, HeaderComponent]
})
export class SunbirdPdfPlayerModule { }
