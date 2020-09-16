import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SunbirdPdfPlayerComponent } from './sunbird-pdf-player.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  declarations: [SunbirdPdfPlayerComponent, HeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxExtendedPdfViewerModule
  ],
  exports: [SunbirdPdfPlayerComponent]
})
export class SunbirdPdfPlayerModule { }
