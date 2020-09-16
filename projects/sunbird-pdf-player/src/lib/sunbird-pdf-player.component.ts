import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, HostListener } from '@angular/core';

import {
  PdfDownloadedEvent, PdfLoadedEvent
} from 'ngx-extended-pdf-viewer';

import { PlayerConfig, Config } from './playerInterfaces';
import { SunbirdPdfPlayerService } from './sunbird-pdf-player.service';
@Component({
  selector: 'sunbird-pdf-player',
  templateUrl: './sunbird-pdf-player.component.html',
  styles: []
})
export class SunbirdPdfPlayerComponent implements OnInit, OnDestroy, OnChanges {
  public pdfConfig: Config;
  private progressInterval: any;
  public pdfVisibility: any;
  public showPlayer = true;
  @Input() playerConfig: PlayerConfig;
  @Input() action: string;
  @Output() playerEvent: EventEmitter<object>;


  constructor(public pdfPlayerService: SunbirdPdfPlayerService) {
    this.playerEvent = this.pdfPlayerService.playerEvent;
  }

  ngOnInit() {
    this.pdfVisibility = 'none';
    this.pdfConfig = { ...this.pdfPlayerService.defaultConfig, ...this.playerConfig.config };
    this.pdfPlayerService.init(this.playerConfig);
    this.updateProgress();
  }

  replayContent() {
    this.showPlayer = false;
    setTimeout(() => {
      this.showPlayer =  true;
    }, 100);
    this.ngOnInit();
  }

  private updateProgress() {
   this.progressInterval =  setInterval(() => {
    if ((window as any).PDFViewerApplication && (window as any).PDFViewerApplication.loadingBar) {
      this.pdfPlayerService.loadingProgress = (window as any).PDFViewerApplication.loadingBar.percent || 0;
      console.log(this.pdfPlayerService.loadingProgress);
     }
   }, 500);
  }

  public onPdfLoaded(event: PdfLoadedEvent): void {
    clearInterval(this.progressInterval);
    this.pdfPlayerService.raiseStartEvent(event);
    this.pdfVisibility = 'inline';
  }

  public onPdfLoadFailed(error: Error): void {
    clearInterval(this.progressInterval);
    this.pdfPlayerService.raiseErrorEvent(error);
    this.pdfVisibility = 'inline';
  }

  public onZoomChange(event: any): void {
      this.pdfPlayerService.pageSessionUpdate();
      this.pdfPlayerService.raiseHeartBeatEvent('ZOOM_CHANGE');
      this.pdfPlayerService.zoom = event;
  }

  public onPdfDownloaded(event: PdfDownloadedEvent): void {
    this.pdfPlayerService.raiseHeartBeatEvent('PDF_DOWNLOAD');
  }

  public onAfterPrint() {
    this.pdfPlayerService.raiseHeartBeatEvent('PDF_PRINT');
  }

  public onRotationChange(event: any): void {
    this.pdfPlayerService.pageSessionUpdate();
    this.pdfPlayerService.raiseHeartBeatEvent('ROTATION_CHANGE');
    this.pdfPlayerService.rotation = event;
  }

  // On Page next and previous or scroll
  public onPageChange(event: any): void {
    this.pdfPlayerService.pageSessionUpdate();
    this.pdfPlayerService.currentPagePointer = event;
    this.pdfPlayerService.raiseHeartBeatEvent('PAGE_CHANGE');
  }

  public performAction(action: any) {
    if ((window as any).PDFViewerApplication) {
        (window as any).PDFViewerApplication.eventBus.dispatch(action);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.action) {
      this.performAction(changes.action);
    }
  }

  private pdfViewerCleanUp() {
    if ((window as any).PDFViewerApplication) {
      (window as any).PDFViewerApplication.cleanup();
      (window as any).PDFViewerApplication.close();
    }
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.pdfPlayerService.pageSessionUpdate();
    this.pdfPlayerService.raiseEndEvent();
    this.pdfViewerCleanUp();
  }
}
