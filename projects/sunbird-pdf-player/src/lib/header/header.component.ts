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
  nextSlide() {
    if (this.pdfPlayerService.totalNumberOfPages === this.pdfPlayerService.currentPagePointer) {
      this.pdfPlayerService.showEndPage = true;
    }
    (window as any).PDFViewerApplication.eventBus.dispatch('nextpage');
  }

  prevSlide() {
      (window as any).PDFViewerApplication.eventBus.dispatch('previouspage');
  }

  zoomIn() {
    (window as any).PDFViewerApplication.zoomIn();
  }

  zoomOut() {
    (window as any).PDFViewerApplication.zoomOut();
  }

  getPage() {
    if (this.pageNumber > 0 && this.pageNumber < this.pdfPlayerService.totalNumberOfPages) {
      (window as any).PDFViewerApplication.page = this.pageNumber;
    }
  }

  openNav() {
    document.getElementById('mySidenav').style.width = '100%';
    document.getElementById('sbPdfPlayerContainer').style.backgroundColor = 'rgba(0,0,0,0.4)';
  }

  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('sbPdfPlayerContainer').style.backgroundColor = 'white';
  }

  openPdfDownloadPopup() {
    this.pdfPlayerService.showDownloadPopup = true;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
