import {
  AfterViewInit, ChangeDetectorRef, Component,

  ElementRef, EventEmitter,
  HostListener, Input,
  OnChanges, OnDestroy, OnInit, Output,

  Renderer2, SimpleChanges,
  ViewChild
} from '@angular/core';
import { Config, PlayerConfig } from './playerInterfaces';
import { ViewerService } from './services/viewer.service';
import { SunbirdPdfPlayerService } from './sunbird-pdf-player.service';
import * as _ from 'lodash';
import { ErrorService , errorCode , errorMessage } from '@project-sunbird/sunbird-player-sdk';
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
  public traceId: string;

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
  @Output() telemetryEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewerActions: EventEmitter<any> = new EventEmitter<any>();
  private unlistenMouseEnter: () => void;
  private unlistenMouseLeave: () => void;
  // private unlistenTouch: () => void;
  defaultCompatibilityLevel = 4;

  constructor(
    public pdfPlayerService: SunbirdPdfPlayerService,
    public viewerService: ViewerService,
    private cdRef: ChangeDetectorRef,
    private renderer2: Renderer2,
    public errorService: ErrorService
  ) {

    this.playerEvent = this.viewerService.playerEvent;
  }

  @HostListener('document:TelemetryEvent', ['$event'])
  onTelemetryEvent(event) {
    this.telemetryEvent.emit(event.detail);
  }

  ngOnInit() {
    this.traceId = this.playerConfig.config['traceId'];
    // Log event when internet is not available
    this.errorService.getInternetConnectivityError.subscribe(event => {
      this.viewerService.raiseExceptionLog(errorCode.internetConnectivity, errorMessage.internetConnectivity, event['error'], this.traceId)
    });
    
    const contentCompabilityLevel = this.playerConfig.metadata['compatibilityLevel'];
    if (contentCompabilityLevel) {
      const checkContentCompatible = this.errorService.checkContentCompatibility(contentCompabilityLevel);
      if (!checkContentCompatible['isCompitable']) {
        this.viewerService.raiseErrorEvent( checkContentCompatible['error'] , 'compatibility-error');
        this.viewerService.raiseExceptionLog( errorCode.contentCompatibility , errorMessage.contentCompatibility, checkContentCompatible['error'], this.traceId)
      }
    }
    this.viewState = 'start';
    this.pdfConfig = { ...this.viewerService.defaultConfig, ...this.playerConfig.config };
    this.sideMenuConfig = { ...this.sideMenuConfig, ...this.playerConfig.config.sideMenu };
    this.pdfPlayerService.initialize(this.playerConfig);
    this.viewerService.initialize(this.playerConfig);
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

  headerActions({ type, data }) {
    if (type === 'NEXT') {
      if (this.viewerService.currentPagePointer === this.viewerService.totalNumberOfPages) {
        this.viewerService.raiseEndEvent();
        this.viewState = 'end';
        this.viewerService.endPageSeen = true;
        this.cdRef.detectChanges();
        return;
      }
    }
    this.viewerActions.emit({ type, data });
    this.viewerService.raiseHeartBeatEvent(type);

  }

  sideBarEvents(event) {
    this.viewerService.raiseHeartBeatEvent(event);
    this.viewerActions.emit({ type: event });
  }

  replayContent(event) {
    this.viewerService.raiseHeartBeatEvent(event.type)
    this.ngOnInit();
    this.viewerActions.emit({ type: 'REPLAY' });
    this.cdRef.detectChanges();
  }

  public onPdfLoaded(event): void {
    const startEvent = this.viewerService.raiseStartEvent(event);
    this.telemetryEvent.emit(startEvent);
    this.viewState = 'player';
    this.cdRef.detectChanges();
  }

  public onPdfLoadFailed(error: Error): void {
    this.viewerService.raiseErrorEvent(error);
    this.viewerService.raiseExceptionLog(errorCode.contentLoadFails , errorMessage.contentLoadFails, error , this.traceId);
    this.viewState = 'player';
  }

  public onZoomChange(event: any): void {
    this.viewerService.pageSessionUpdate();
    this.viewerService.raiseHeartBeatEvent('ZOOM_CHANGE');
    this.viewerService.zoom = event;
  }

  public onPdfDownloaded(): void {
    this.viewerService.raiseHeartBeatEvent('PDF_DOWNLOAD');
  }

  public onAfterPrint() {
    this.viewerService.raiseHeartBeatEvent('PDF_PRINT');
  }

  public onRotationChange(event: any): void {
    this.viewerService.pageSessionUpdate();
    this.viewerService.raiseHeartBeatEvent('ROTATION_CHANGE');
    this.viewerService.rotation = event;
  }

  // On Page next and previous or scroll
  public onPageChange(event: any): void {
    this.viewerService.pageSessionUpdate();
    this.viewerService.currentPagePointer = event.pageNumber;
    this.viewerService.raiseHeartBeatEvent('PAGE_CHANGE');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.action) {
      this.viewerActions.emit({ type: changes.action });
    }
  }

  public viewerEvent({ type, data }) {
    if (type === 'progress') {
      this.viewerService.loadingProgress = data;
    } else if (type === 'pagesloaded') {
      this.onPdfLoaded(data);
    } else if (type === 'pagechanging') {
      this.onPageChange(data);
    } else if (type === 'rotatecw') {
      this.onRotationChange(data);
    } else if (type === 'pageend') {
      this.viewerService.raiseEndEvent();
      this.viewerService.endPageSeen = true;
      this.viewState = 'end';
    } else if (type === 'error') {
      this.onPdfLoadFailed(data);
    }
    this.cdRef.detectChanges();
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.viewerService.raiseEndEvent();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.unlistenMouseEnter();
    this.unlistenMouseLeave();
    // this.unlistenTouch();
  }
}
