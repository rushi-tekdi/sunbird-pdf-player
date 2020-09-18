import { Component, OnInit } from '@angular/core';
import { SunbirdPdfPlayerService } from '../sunbird-pdf-player.service';

@Component({
  selector: 'next-navigation',
  templateUrl: './next-navigation.component.html',
  styleUrls: ['./next-navigation.component.scss']
})
export class NextNavigationComponent implements OnInit {

  constructor(public pdfPlayerService: SunbirdPdfPlayerService) { }

  ngOnInit() {
  }

  nextSlide() {
    const nextPage = this.pdfPlayerService.currentPagePointer + 1;
    (window as any).PDFViewerApplication.eventBus.dispatch('nextpage');
    if (this.pdfPlayerService.totalNumberOfPages < nextPage) {
      this.pdfPlayerService.viewState = 'end';
      this.pdfPlayerService.raiseEndEvent();
    }
    this.pdfPlayerService.raiseHeartBeatEvent('NEXT_PAGE');
  }
}
