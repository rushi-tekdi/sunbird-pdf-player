import { Injectable, EventEmitter } from '@angular/core';
import {CsTelemetryModule} from '@project-sunbird/client-services/telemetry';
import {  PlayerConfig } from './playerInterfaces';
import { PdfLoadedEvent } from 'ngx-extended-pdf-viewer';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SunbirdPdfPlayerService {

  private version = '1.0';
  public zoom = 'auto';
  public rotation = 0;
  public playerEvent = new EventEmitter<any>();
  public contentName: string;
  public loadingProgress: number;
  public src: string;
  public userName: string;

  private metaData: any;

  currentPagePointer: number;
  totalNumberOfPages: number;
  pdfPlayerStartTime: number;
  pdfLastPageTime: number;

  defaultConfig = {
    showPropertiesButton: false,
    textLayer: true,
    showHandToolButton: false,
    useBrowserLocale: true,
    showBookmarkButton: false,
    showBorders: true,
    startFromPage: 1,
    contextMenuAllowed: false,
    showSidebarButton: false,
    showFindButton: false,
    showPagingButtons: false,
    showZoomButtons: false,
    showPresentationModeButton: false,
    showPrintButton: false,
    showDownloadButton: false,
    showSecondaryToolbarButton: false,
    showRotateButton: false,
    showScrollingButton: false,
    showSpreadButton: false,
    backgroundColor: '#FFFFFF',
    height: '100%',
    zoom: this.zoom,
    rotation: this.rotation
  };

  constructor(private http: HttpClient) {}

  init({ context, config, metadata}: PlayerConfig) {
    CsTelemetryModule.instance.init({});
    CsTelemetryModule.instance.telemetryService.initTelemetry(
      {
        config: {
          pdata: context.pdata,
          env: 'ContentPlayer',
          channel: context.channel,
          did: context.did,
          authtoken: context.authToken || '',
          uid: context.uid || '',
          sid: context.sid,
          batchsize: 20,
          mode: context.mode,
          host: context.host || '',
          endpoint: context.endpoint || 'data/v3/telemetry',
          tags: context.tags,
          cdata: context.cdata
        },
        userOrgDetails: {}
    }
    );
    this.pdfPlayerStartTime = this.pdfLastPageTime = new Date().getTime();
    this.totalNumberOfPages = 0;
    this.currentPagePointer = (config && config.startFromPage ) || 1;
    this.contentName = metadata.name;
    this.src = metadata.artifactUrl;
    this.userName = context.userData ? `${context.userData.firstName} ${context.userData.lastName}` : '';
    this.metaData = {
      pagesHistory: [],
      totalPages: 0,
      duration: [],
      zoom: [],
      rotation: []
    };
    this.loadingProgress = 0;
    this.rotation = 0;
    this.zoom = 'auto';
  }

  public pageSessionUpdate() {
    this.metaData.pagesHistory.push(this.currentPagePointer);
    this.metaData.duration.push(new Date().getTime() - this.pdfLastPageTime);
    this.metaData.zoom.push(this.zoom);
    this.metaData.rotation.push(this.rotation);
    this.pdfLastPageTime = new Date().getTime();
  }

  raiseStartEvent(event: PdfLoadedEvent) {

    this.currentPagePointer = this.currentPagePointer > event.pagesCount ? 1 : this.currentPagePointer,
    this.metaData.totalPages = event.pagesCount;
    const startEvent =  {
      eid: 'START',
      ver: this.version,
      edata: {
        type: 'START',
        currentPage: this.currentPagePointer,
        duration: new Date().getTime() - this.pdfPlayerStartTime
      },
      metaData: this.metaData
    };
    this.playerEvent.emit(startEvent);
    CsTelemetryModule.instance.playerTelemetryService.onStartEvent(startEvent, {}); // object 
    this.pdfLastPageTime = this.pdfPlayerStartTime = new Date().getTime();

  }

  raiseEndEvent() {
   const endEvent =  {
      eid: 'END',
      ver: this.version,
      edata: {
        type: 'END',
        currentPage: this.currentPagePointer,
        totalPages: this.totalNumberOfPages,
        duration: new Date().getTime() - this.pdfPlayerStartTime
      },
      metaData: this.metaData
    };
   const summery = {}; // TODO: add the summery info here
   this.playerEvent.emit(endEvent);
   CsTelemetryModule.instance.playerTelemetryService.onEndEvent(endEvent, summery);
  }

  raiseErrorEvent(error: Error) {
    const errorEvent =       {
      eid: 'ERROR',
      ver: this.version,
      edata: {
        type: 'ERROR',
        stacktrace: error ? error.toString() : undefined
      },
      metaData: this.metaData
    };
    this.playerEvent.emit(errorEvent);
    CsTelemetryModule.instance.playerTelemetryService.onErrorEvent(errorEvent, {});
  }

  raiseHeartBeatEvent(type: string) {
    const hearBeatEvent =  {
      eid: 'HEARTBEAT',
      ver: this.version,
      edata: {
        type,
        currentPage: this.currentPagePointer
      },
      metaData: this.metaData
    };
    this.playerEvent.emit(hearBeatEvent);
    CsTelemetryModule.instance.playerTelemetryService.onHeartBeatEvent(hearBeatEvent, {});

  }

  public getTimeSpentForUI() {
    const duration = new Date().getTime() - this.pdfPlayerStartTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Number(((duration % 60000) / 1000).toFixed(0));
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
}
