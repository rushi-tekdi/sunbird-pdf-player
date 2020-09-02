import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, HostListener } from '@angular/core';

import {
  PdfDownloadedEvent, PdfLoadedEvent, TextLayerRenderedEvent
} from 'ngx-extended-pdf-viewer';

import { IPlayerEvent, PdfComponentInput } from './playerInterfaces';
@Component({
  selector: 'sunbird-pdf-player',
  templateUrl: './sunbird-pdf-player.component.html',
  styles: []
})
export class SunbirdPdfPlayerComponent implements OnInit, OnDestroy, OnChanges {
  private version = '1.0';
  @Input() pdfConfig: PdfComponentInput;
  @Input() navigation: string;
  @Output() sendMetadata: EventEmitter<object> = new EventEmitter<IPlayerEvent>();
  private metaData = {
    numberOfPagesVisited: [],
    totalPages: 0,
    duration: []
  };

  currentPagePointer: number;
  totalNumberOfPages: number;
  pdfPlayerStartTime: number;
  pdfLastPageTime: number;
  pdfPlayerEvent: IPlayerEvent;
  messages: Array<string> = [];
  showBorders = false;
  visits = [];
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
    backgroundColor: '#00000'
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
    this.sendMetadata.emit(
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
    this.sendMetadata.emit(
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

  public onZoomChange(event: any): void {
    this.sendHeartBeatEvent(
      {
        type: 'ZOOM_CHANGE',
        currentPage: this.currentPagePointer,
        zoomValue: event
      }
    );
    // tslint:disable-next-line:comment-format
    //this.setPlayerEvent('HEARTBEAT', 'INTERACT', this.currentPagePointer, this.totalNumberOfPages, this.currentPagePointer, this.visits);
  }

  public onTextLayerRendered(event: TextLayerRenderedEvent): void {
    this.sendHeartBeatEvent({
      type: 'TEXT_LAYER_RENDERED',
      currentPage: event.pageNumber,
      numTextDivs: event.numTextDivs
    });
  }

  public onHandToolChange(event: any): void {
    this.sendHeartBeatEvent({
      type: 'HAND_TOOL_CHANGE',
      currentPage: this.currentPagePointer,
      enabled: event
    });
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
      type: 'PDF_BEFORE_PRINT',
      currentPage: this.currentPagePointer
    });
  }

  public onBeforePrint() {
    this.sendHeartBeatEvent({
      type: 'PDF_AFTER_PRINT',
      currentPage: this.currentPagePointer
    });
  }

  public onRotationChange(event: any): void {
    this.sendHeartBeatEvent({
      type: 'ROTATION_CHANGE',
      currentPage: this.currentPagePointer,
      degrees: event
    });
  }

  // On Page next and previous or scroll
  public onPageChange(event: any): void {
    this.metaData.numberOfPagesVisited.push(this.currentPagePointer);
    this.metaData.duration.push(new Date().getTime() - this.pdfLastPageTime);
    this.currentPagePointer = event;
    this.pdfLastPageTime = new Date().getTime();
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
    this.sendMetadata.emit(
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
    this.metaData.numberOfPagesVisited.push(this.currentPagePointer);
    this.metaData.duration.push(new Date().getTime() - this.pdfLastPageTime);
    this.sendMetadata.emit({
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
