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
  }

  zoomOut() {
    (window as any).PDFViewerApplication.zoomOut();
  }

  gotoPage() {
    if (this.pageNumber > 0 && this.pageNumber <= this.pdfPlayerService.totalNumberOfPages) {
      (window as any).PDFViewerApplication.page = parseInt(this.pageNumber, 10) ;
    }
    this.totalPageView = true;
  }

  openPdfDownloadPopup() {
    this.pdfPlayerService.showDownloadPopup = true;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
