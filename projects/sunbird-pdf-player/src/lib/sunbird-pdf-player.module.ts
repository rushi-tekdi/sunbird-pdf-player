import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '././header/header.component';
import { DownloadPdfPopupComponent } from './download-pdf-popup/download-pdf-popup.component';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
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
    HttpClientModule,
    NgxExtendedPdfViewerModule
  ],
  exports: [SunbirdPdfPlayerComponent, HeaderComponent]
})
export class SunbirdPdfPlayerModule { }
