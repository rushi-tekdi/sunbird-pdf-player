import { Component, OnInit, Input, Output, EventEmitter,
  OnDestroy, OnChanges, SimpleChanges, HostListener,
  ChangeDetectorRef, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { PlayerConfig, Config } from './playerInterfaces';
import { SunbirdPdfPlayerService } from './sunbird-pdf-player.service';
@Component({
  selector: 'sunbird-pdf-player',
  templateUrl: './sunbird-pdf-player.component.html',
  styleUrls: ['./sunbird-pdf-player.component.scss']
})
export class SunbirdPdfPlayerComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  public pdfConfig: Config;
  public showPlayer = true;
  private subscription;
  public viewState = 'start';
  public showControls = true;
  @ViewChild('pdfPlayer') pdfPlayerRef: ElementRef;
  sideMenuConfig = {
    showShare: true,
    showDownload: true,
    showReplay: true,
    showExit: false
  };
  @Input() playerConfig: PlayerConfig;
  @Input() action: string;
  @Output() playerEvent: EventEmitter<object>;
  @Output() telemetryEvent: EventEmitter<any> =  new EventEmitter<any>();
  @Output() viewerActions: EventEmitter<any> =  new EventEmitter<any>();
  private unlistenMouseEnter: () => void;
  private unlistenMouseLeave: () => void;
  // private unlistenTouch: () => void;

  constructor(public pdfPlayerService: SunbirdPdfPlayerService,
              private cdRef: ChangeDetectorRef, private renderer2: Renderer2) {

    this.playerEvent = this.pdfPlayerService.playerEvent;
    this.subscription =  this.pdfPlayerService.playerEvent.subscribe((data) => {
      if (data.edata.type === 'REPLAY') {
        this.replayContent();
      }
    });
  }

  @HostListener('document:TelemetryEvent', ['$event'])
  onTelemetryEvent(event) {
    this.telemetryEvent.emit(event.detail);
  }

  ngOnInit() {
    this.viewState = 'start';
    this.pdfConfig = { ...this.pdfPlayerService.defaultConfig, ...this.playerConfig.config };
    this.sideMenuConfig =  {...this.sideMenuConfig, ...this.playerConfig.config.sideMenu};
    this.pdfPlayerService.init(this.playerConfig);
  }

  ngAfterViewInit() {
    const pdfPlayerElement = this.pdfPlayerRef.nativeElement;
    this.unlistenMouseEnter = this.renderer2.listen(pdfPlayerElement, 'mouseenter', () => {
      this.showControls = true;
    });

    this.unlistenMouseLeave = this.renderer2.listen(pdfPlayerElement, 'mouseleave', () => {
      this.showControls = false;
    });
    // this.unlistenTouch = this.renderer2.listen(pdfPlayerElement, 'touchstart', () => {
    //   this.showControls = !this.showControls;
    // });
  }

  headerActions({type, data}) {
    if (type === 'header:zoomIn') {
      this.viewerActions.emit({type: 'ZOOM_IN'});
    } else if (type === 'header:zoomOut') {
      this.viewerActions.emit({type: 'ZOOM_OUT'});
    } else if (type === 'header:next') {
      if (this.pdfPlayerService.currentPagePointer === this.pdfPlayerService.totalNumberOfPages) {
        this.pdfPlayerService.raiseEndEvent();
        this.viewState = 'end';
        this.cdRef.detectChanges();
      } else {
        this.viewerActions.emit({type: 'NEXT_PAGE'});
      }
    } else if (type === 'header:previous') {
      this.viewerActions.emit({type: 'PREVIOUS_PAGE'});
    } else if (type === 'header:navigateToPage') {
      this.viewerActions.emit({type: 'NAVIGATE_TO_PAGE', data});
    }
  }

  replayContent() {
    this.ngOnInit();
    this.viewerActions.emit({type: 'REPLAY'});
    this.cdRef.detectChanges();
  }

  public onPdfLoaded(event): void {
    this.pdfPlayerService.raiseStartEvent(event);
    this.viewState = 'player';
    this.cdRef.detectChanges();
  }

  public onPdfLoadFailed(error: Error): void {
    this.pdfPlayerService.raiseErrorEvent(error);
    this.viewState = 'player';
  }

  public onZoomChange(event: any): void {
      this.pdfPlayerService.pageSessionUpdate();
      this.pdfPlayerService.raiseHeartBeatEvent('ZOOM_CHANGE');
      this.pdfPlayerService.zoom = event;
  }

  public onPdfDownloaded(): void {
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
    this.pdfPlayerService.currentPagePointer = event.pageNumber;
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



  public viewerEvent({type, data}) {
    if (type === 'progress') {
      this.pdfPlayerService.loadingProgress = data;
    } else if (type === 'pagesloaded') {
      this.onPdfLoaded(data);
    } else if (type === 'pagechanging') {
      this.onPageChange(data);
    } else if (type === 'pageend') {
      this.pdfPlayerService.raiseEndEvent();
      this.viewState = 'end';
    } else if (type === 'error') {
      this.onPdfLoadFailed(data);
    }
    this.cdRef.detectChanges();
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.pdfPlayerService.pageSessionUpdate();
    this.pdfPlayerService.raiseEndEvent();
    this.subscription.unsubscribe();
    this.unlistenMouseEnter();
    this.unlistenMouseLeave();
    // this.unlistenTouch();
  }
}
