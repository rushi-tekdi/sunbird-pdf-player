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
    document.getElementById('pdfPlayerSideMenu').style.width = '100%';
    document.getElementById('sbPdfPlayerContainer').style.backgroundColor = 'rgba(0,0,0,0.4)';
    this.pdfPlayerService.raiseHeartBeatEvent('OPEN_MENU');
  }
}
