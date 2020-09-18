import { Component, OnInit, OnDestroy } from '@angular/core';
import { SunbirdPdfPlayerService } from '../sunbird-pdf-player.service';

@Component({
  selector: 'pdf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent implements OnInit, OnDestroy {
  pageNumber;
  subscription;
  totalPageView = true;
  constructor(public pdfPlayerService: SunbirdPdfPlayerService) {
  }

  ngOnInit(): void {
    this.pageNumber = this.pdfPlayerService.currentPagePointer;
    this.subscription  = this.pdfPlayerService.playerEvent.subscribe(data => {
      if (data.edata.type === 'PAGE_CHANGE') {
        this.pageNumber = this.pdfPlayerService.currentPagePointer;
      }
    });
  }

  zoomIn() {
    (window as any).PDFViewerApplication.zoomIn();
    this.pdfPlayerService.raiseHeartBeatEvent('ZOOM_IN');
  }

  zoomOut() {
    (window as any).PDFViewerApplication.zoomOut();
    this.pdfPlayerService.raiseHeartBeatEvent('ZOOM_OUT');
  }

  gotoPage() {
    if (this.pageNumber > 0 && this.pageNumber <= this.pdfPlayerService.totalNumberOfPages) {
      (window as any).PDFViewerApplication.page = parseInt(this.pageNumber, 10) ;
    } else {
      this.pageNumber = this.pdfPlayerService.currentPagePointer;
    }
    this.totalPageView = true;
    this.pdfPlayerService.raiseHeartBeatEvent('NAVIGATE_TO_PAGE');
  }

  openPdfDownloadPopup() {
    this.pdfPlayerService.showDownloadPopup = true;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
