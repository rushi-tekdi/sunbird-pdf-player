import { Component, OnInit } from '@angular/core';
import { SunbirdPdfPlayerService } from '../sunbird-pdf-player.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(public pdfPlayerService: SunbirdPdfPlayerService) { }

  ngOnInit() {
  }

  closeNav() {
    document.getElementById('pdfPlayerSideMenu').style.width = '0';
    document.getElementById('sbPdfPlayerContainer').style.backgroundColor = 'white';
    this.pdfPlayerService.raiseHeartBeatEvent('CLOSE_MENU');
  }

  openPdfDownloadPopup() {
    this.pdfPlayerService.showDownloadPopup = true;
    this.pdfPlayerService.raiseHeartBeatEvent('DOWNLOAD_MENU');
  }

}
