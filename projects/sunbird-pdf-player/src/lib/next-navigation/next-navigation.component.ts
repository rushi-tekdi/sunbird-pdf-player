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
    if (this.pdfPlayerService.totalNumberOfPages === this.pdfPlayerService.currentPagePointer) {
      this.pdfPlayerService.showEndPage = true;
    }
    (window as any).PDFViewerApplication.eventBus.dispatch('nextpage');
  }
}
