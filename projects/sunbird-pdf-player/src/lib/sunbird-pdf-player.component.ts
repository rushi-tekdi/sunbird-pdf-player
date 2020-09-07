import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, HostListener } from '@angular/core';

import {
  PdfDownloadedEvent, PdfLoadedEvent, TextLayerRenderedEvent
} from 'ngx-extended-pdf-viewer';

import { PdfComponentInput } from './playerInterfaces';
@Component({
  selector: 'sunbird-pdf-player',
  templateUrl: './sunbird-pdf-player.component.html',
  styles: []
})
export class SunbirdPdfPlayerComponent implements OnInit, OnDestroy, OnChanges {
  private version = '1.0';
  private zoom = 'auto';
  private rotation = 0;
  @Input() pdfConfig: PdfComponentInput;
  @Input() navigation: string;
  @Output() playerEvent: EventEmitter<object> = new EventEmitter<any>();
  private metaData = {
    numberOfPagesVisited: [],
    totalPages: 0,
    duration: [],
    zoom: [],
    rotation: []
  };

  currentPagePointer: number;
  totalNumberOfPages: number;
  pdfPlayerStartTime: number;
  pdfLastPageTime: number;
  // tslint:disable-next-line:variable-name
  defaultConfig = {
    showPropertiesButton: false,
    textLayer: true,
    showHandToolButton: false,
    useBrowserLocale: true,
    showBookmarkButton: false,
    showBorders: true,
    startFromPage: 0,
    contextMenuAllowed: true,
    showSidebarButton: false,
    showFindButton: true,
    showPagingButtons: true,
    showZoomButtons: true,
    showPresentationModeButton: false,
    showPrintButton: true,
    showDownloadButton: true,
    showSecondaryToolbarButton: false,
    showRotateButton: true,
    showScrollingButton: false,
    showSpreadButton: false,
    backgroundColor: '#000000',
    height: '100%',
    zoom: this.zoom,
    rotation: this.rotation
  };

  ngOnInit(): void {
    this.pdfConfig = { ...this.defaultConfig, ...this.pdfConfig };
    this.pdfPlayerStartTime = this.pdfLastPageTime = new Date().getTime();
    this.totalNumberOfPages = 0;
    this.currentPagePointer = this.pdfConfig.startFromPage;
  }

  public onPdfLoaded(event: PdfLoadedEvent): void {
    this.currentPagePointer = this.pdfConfig.startFromPage > event.pagesCount ? 1 : this.pdfConfig.startFromPage,
    this.metaData.totalPages = event.pagesCount;
    this.totalNumberOfPages = event.pagesCount;
    this.playerEvent.emit(
        {
          eid: 'START',
          ver: this.version,
          edata: {
            type: 'START',
            currentPage: this.currentPagePointer,
            totalPages: event.pagesCount,
            duration: new Date().getTime() - this.pdfPlayerStartTime
          },
          metaData: this.metaData
        }
      );
    this.pdfLastPageTime = this.pdfPlayerStartTime = new Date().getTime();
  }

  public onPdfLoadFailed(error: Error): void {
    this.playerEvent.emit(
      {
        eid: 'ERROR',
        ver: this.version,
        edata: {
          type: 'ERROR',
          stacktrace: error ? error.toString() : undefined
        },
        metaData: this.metaData
      }
    );
  }


  private pageSessionUpdate() {
    this.metaData.numberOfPagesVisited.push(this.currentPagePointer);
    this.metaData.duration.push(new Date().getTime() - this.pdfLastPageTime);
    this.metaData.zoom.push(this.zoom);
    this.metaData.rotation.push(this.rotation);
    this.pdfLastPageTime = new Date().getTime();
  }

  public onZoomChange(event: any): void {
      this.pageSessionUpdate();
      this.sendHeartBeatEvent({
        type: 'ZOOM_CHANGE',
        currentPage: this.currentPagePointer
      });
      this.zoom = event;
  }

  public onPdfDownloaded(event: PdfDownloadedEvent): void {
    this.sendHeartBeatEvent({
      type: 'PDF_DOWNLOAD',
      currentPage: this.currentPagePointer,
      data: event
    });
  }

  public onAfterPrint() {
    this.sendHeartBeatEvent({
      type: 'PDF_PRINT',
      currentPage: this.currentPagePointer
    });
  }

  public onRotationChange(event: any): void {
    this.pageSessionUpdate();
    this.sendHeartBeatEvent({
      type: 'ROTATION_CHANGE',
      currentPage: this.currentPagePointer
    });
    this.rotation = event;
  }

  // On Page next and previous or scroll
  public onPageChange(event: any): void {
    console.log(this.pdfConfig);
    this.pageSessionUpdate();
    this.currentPagePointer = event;
    this.sendHeartBeatEvent({
      type: 'PAGE_CHANGE',
      currentPage: this.currentPagePointer
    });
  }

  public navigatePdf(direction: any) {
    if ((window as any).PDFViewerApplication) {
      direction === 'next' ?
        (window as any).PDFViewerApplication.eventBus.dispatch('nextpage') :
        (window as any).PDFViewerApplication.eventBus.dispatch('previouspage');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.navigation) {
      this.navigatePdf(changes.navigation.currentValue.navigate);
    }
  }


  private sendHeartBeatEvent(edata: any) {
    this.playerEvent.emit(
      {
        eid: 'HEARTBEAT',
        ver: this.version,
        edata,
        metaData: this.metaData
      });
  }

  private pdfViewerCleanUp() {
    if ((window as any).PDFViewerApplication) {
      (window as any).PDFViewerApplication.cleanup();
      (window as any).PDFViewerApplication.close();
    }
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.pageSessionUpdate();
    this.playerEvent.emit({
      eid: 'END',
      ver: this.version,
      edata: {
        type: 'END',
        currentPage: this.currentPagePointer,
        totalPages: this.totalNumberOfPages,
        duration: new Date().getTime() - this.pdfPlayerStartTime
      },
      metaData: this.metaData
    });
    this.pdfViewerCleanUp();
  }
}
