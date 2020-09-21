import { Component, OnInit } from '@angular/core';
import { SunbirdPdfPlayerService } from '../sunbird-pdf-player.service';

@Component({
  selector: 'previous-navigation',
  templateUrl: './previous-navigation.component.html',
  styleUrls: ['./previous-navigation.component.scss']
})
export class PreviousNavigationComponent implements OnInit {

  constructor(public pdfPlayerService: SunbirdPdfPlayerService) { }

  ngOnInit() {
  }

  prevSlide() {
    (window as any).PDFViewerApplication.eventBus.dispatch('previouspage');
    this.pdfPlayerService.raiseHeartBeatEvent('PREVIOUS_PAGE');
  }
}
