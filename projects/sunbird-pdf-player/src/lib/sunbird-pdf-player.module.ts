import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '././header/header.component';
import { DownloadPdfPopupComponent } from './download-pdf-popup/download-pdf-popup.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunbirdPdfPlayerComponent } from './sunbird-pdf-player.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { StartPageComponent } from './start-page/start-page.component';
import { EndPageComponent } from './end-page/end-page.component';

@NgModule({
  declarations: [SunbirdPdfPlayerComponent, HeaderComponent, DownloadPdfPopupComponent, StartPageComponent, EndPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxExtendedPdfViewerModule
  ],
  exports: [SunbirdPdfPlayerComponent, HeaderComponent]
})
export class SunbirdPdfPlayerModule { }
