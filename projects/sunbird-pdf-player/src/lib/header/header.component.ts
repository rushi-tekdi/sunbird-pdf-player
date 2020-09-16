import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';


@Component({
  selector: 'pdf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {
  @Input() duration?: any;
  @Input() disablePreviousNavigation: boolean;
  @Output() nextSlideClicked = new EventEmitter<any>();
  @Output() prevSlideClicked = new EventEmitter<any>();
  @Output() durationEnds = new EventEmitter<any>();
  time: any;
  pagesCount: number;
  pageNumber: number;
  constructor() {
  }


  ngOnInit() {
    this.pageNumber = 1;
    this.pagesCount = 80; // (window as any).PDFViewerApplication.page;
    if (this.duration) {
    }
  }

  nextSlide() {
    (window as any).PDFViewerApplication.eventBus.dispatch('nextpage');
  }

  prevSlide() {
    if (!this.disablePreviousNavigation) {
      (window as any).PDFViewerApplication.eventBus.dispatch('previouspage');
    }
  }

  zoomIn() {
    (window as any).PDFViewerApplication.zoomIn();
  }

  zoomOut() {
    (window as any).PDFViewerApplication.zoomOut();
  }

  rotateLeft() {
    (window as any).PDFViewerApplication.rotatePages(270);
  }

  rotateRight() {
    (window as any).PDFViewerApplication.rotatePages(90);
  }

  getPage() {
    console.log(this.pageNumber);
    (window as any).PDFViewerApplication.page = this.pageNumber;
  }

  openNav() {
    document.getElementById('mySidenav').style.width = '100%';
    document.body.style.backgroundColor = 'rgba(0,0,0,0.4)';
  }

  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.body.style.backgroundColor = 'white';
  }
}
