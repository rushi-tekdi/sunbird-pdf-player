import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import {
  PagesLoadedEvent, PageRenderedEvent,
  PdfDownloadedEvent, PdfLoadedEvent, TextLayerRenderedEvent, ScaleChangingEvent
} from 'ngx-extended-pdf-viewer';

import { IPlayerEvent, PdfComponentInput, telEventType } from './playerInterfaces';
@Component({
  selector: 'sunbird-pdf-player',
  templateUrl: './sunbird-pdf-player.component.html',
  styles: []
})
export class SunbirdPdfPlayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() pdfConfig: PdfComponentInput;
  @Input() navigation: string;
  @Output() sendMetadata: EventEmitter<object> = new EventEmitter<IPlayerEvent>();

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
    showOpenFileButton: false,
    showPropertiesButton: false,
    textLayer: true,
    showHandToolButton: false,
    useBrowserLocale: true,
    showBookmarkButton: true,
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
    showRotateButton: false,
    showScrollingButton: false,
    showSpreadButton: false,
    backgroundColor: '#00000'
  };

  ngOnDestroy(): void {
    this.setPlayerEvent('END', 'END', this.currentPagePointer, this.totalNumberOfPages, this.currentPagePointer, this.visits);
    this.pdfViewerCleanUp();
  }

  ngOnInit(): void {
    this.pdfConfig = { ...this.pdfConfig, ...this.defaultConfig };
    this.pdfPlayerStartTime = this.pdfLastPageTime = new Date().getTime();
    this.totalNumberOfPages = 0;
  }

  private pdfViewerCleanUp() {
    if ((window as any).PDFViewerApplication) {
      (window as any).PDFViewerApplication.cleanup();
      (window as any).PDFViewerApplication.close();
    }
  }


  public setPlayerEvent(eventType: string, eid: telEventType, numberOfPagesVisited: number, numberOfPages: number,
                        currentPage: number, pageDuration?: Array<object>, highlights?: Array<object>) {
    this.pdfPlayerEvent = {
      eventType,
      metaData: {
        eid,
        numberOfPagesVisited: Number(pageDuration.length),
        totalNumberOfPages: numberOfPages,
        currentPagePointer: currentPage,
        pageDuration,
        highlights,
        sessionId: '',
        userPlayBehavior: [],
      }
    };

    this.sendMetadata.emit(this.pdfPlayerEvent);
  }

  public onPagesLoaded(event: PagesLoadedEvent) {
    this.totalNumberOfPages = event.pagesCount;
    // console.log('onPagesLoaded: Document loaded with ' + event + ' pages');
  }

  public onPageRendered(event: PageRenderedEvent) {

  }

  public onPdfLoaded(event: PdfLoadedEvent): void {
    this.setPlayerEvent('START', 'START', this.currentPagePointer, this.totalNumberOfPages, this.currentPagePointer, this.visits);
    // console.log('onPdfLoaded PDF loaded with ' + event.pagesCount + ' pages');
  }


  public onScaleChange(event: ScaleChangingEvent): void {
    console.log(event);
  }

  public onPdfLoadFailed(error: Error): void {
    this.setPlayerEvent('FAILED', 'FAILED', this.currentPagePointer, this.totalNumberOfPages, this.currentPagePointer, this.visits);
    console.log(error);
  }


  public onZoomChange(event: any): void {
    this.setPlayerEvent('HEARTBEAT', 'INTERACT', this.currentPagePointer, this.totalNumberOfPages, this.currentPagePointer, this.visits);
  }


  public selectedZoomFactor(event: any) {
    // console.log("selectedZoomFactor",event)
  }

  public onTextLayerRendered(event: TextLayerRenderedEvent): void {
  }

  public getSelect(event: any): void {
    this.setPlayerEvent('HEARTBEAT', 'INTERACT', this.currentPagePointer, this.totalNumberOfPages, this.currentPagePointer, this.visits);
  }

  public onPdfDownloaded(event: PdfDownloadedEvent): void {
    this.setPlayerEvent('HEARTBEAT', 'INTERACT', this.currentPagePointer, this.totalNumberOfPages, this.currentPagePointer, this.visits);
  }

  public onAfterPrint(event: any) {
    this.setPlayerEvent('HEARTBEAT', 'IMPRESSION', this.currentPagePointer, this.totalNumberOfPages, this.currentPagePointer, this.visits);
  }

  public onBeforePrint(event: any): void {
    // console.log("onBeforePrint",event);
  }

  public onRotationChange(event: any): void {
    this.setPlayerEvent('HEARTBEAT', 'INTERACT', this.currentPagePointer, this.totalNumberOfPages, this.currentPagePointer, this.visits);
  }

  // On Page next and previous or scroll
  public onPageChange(event: any): void {
    this.currentPagePointer = event;
    const tags = {
      page: this.currentPagePointer,
      spentTime: new Date().getTime() - this.pdfLastPageTime
    };
    this.pdfLastPageTime = new Date().getTime();
    this.visits.push(tags);
    this.setPlayerEvent('HEARTBEAT', 'INTERACT', this.currentPagePointer, this.totalNumberOfPages, this.currentPagePointer, this.visits);
    this.setPlayerEvent('HEARTBEAT', 'IMPRESSION', this.currentPagePointer, this.totalNumberOfPages, this.currentPagePointer, this.visits);
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


}
