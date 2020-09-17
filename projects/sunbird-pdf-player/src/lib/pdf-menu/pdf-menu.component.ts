import { Component, OnInit } from '@angular/core';
import { SunbirdPdfPlayerService } from '../sunbird-pdf-player.service';

@Component({
  selector: 'pdf-menu',
  templateUrl: './pdf-menu.component.html',
  styleUrls: ['./pdf-menu.component.scss']
})
export class PdfMenuComponent implements OnInit {

  constructor(public pdfPlayerService: SunbirdPdfPlayerService) { }

  ngOnInit() {
  }

  openNav() {
    this.pdfPlayerService.showMenu = true;
  }

  closeNav() {
    this.pdfPlayerService.showMenu = false;
  }

  openPdfDownloadPopup() {
    this.pdfPlayerService.showDownloadPopup = true;
  }
}
