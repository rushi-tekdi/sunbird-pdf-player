import { Injectable, EventEmitter } from '@angular/core';
import {CsTelemetryModule} from '@project-sunbird/client-services/telemetry';
import {  PlayerConfig } from './playerInterfaces';
import { PdfLoadedEvent } from 'ngx-extended-pdf-viewer';
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
  public showDownloadPopup: boolean;
  public src: string;
  public userName: string;
  private metaData: any;
  private contentSessionId: string;
  private playSessionId: string;
  private telemetryObject: any;
  private context;
  public config;
  currentPagePointer = 0;
  totalNumberOfPages = 0;
  pdfPlayerStartTime: number;
  pdfLastPageTime: number;
  showEndPage = false;
  viewState = 'start';
  timeSpent = '0:0';

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
    sidebarVisible: false,
    enablePinchOnMobile: true,
    backgroundColor: '#FFFFFF',
    height: '100%',
    zoom: this.zoom,
    rotation: this.rotation
  };

  constructor() {
    this.contentSessionId = this.uniqueId();
  }

  init({ context, config, metadata}: PlayerConfig, replay= false) {
    this.context =  context;
    this.config = config;
    this.playSessionId = this.uniqueId();

    if (!CsTelemetryModule.instance.isInitialised) {
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
            endpoint: context.endpoint || '/data/v3/telemetry',
            tags: context.tags,
            cdata : [{id: this.contentSessionId, type: 'ContentSession'},
            {id: this.playSessionId, type: 'PlaySession'}]
          },
          userOrgDetails: {}
        }
      );
    }
    this.pdfPlayerStartTime = this.pdfLastPageTime = new Date().getTime();
    this.totalNumberOfPages = 0;
    this.currentPagePointer = (config && config.startFromPage ) || 1;
    this.contentName = metadata.name;
    this.src = metadata.artifactUrl;
    if (context.userData) {
      this.userName = context.userData.firstName === context.userData.lastName ? context.userData.firstName :
      `${context.userData.firstName} ${context.userData.lastName}`;
    }
    this.metaData = {
      pagesHistory: [],
      totalPages: 0,
      duration: [],
      zoom: [],
      rotation: []
    };
    this.loadingProgress = 0;
    this.showDownloadPopup = false;
    this.rotation = 0;
    this.zoom = 'auto';
    this.telemetryObject = {
        id: metadata.identifier,
        type: 'Content',
        ver: metadata.pkgVersion + '',
        rollup: context.objectRollup || {}
      };
    this.showEndPage = false;
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
    this.totalNumberOfPages = event.pagesCount;
    const duration = new Date().getTime() - this.pdfPlayerStartTime;
    const startEvent =  {
      eid: 'START',
      ver: this.version,
      edata: {
        type: 'START',
        currentPage: this.currentPagePointer,
        duration
      },
      metaData: this.metaData
    };
    this.playerEvent.emit(startEvent);
    CsTelemetryModule.instance.telemetryService.raiseStartTelemetry(
      { options: {
        object: this.telemetryObject,
        context: this.getEventContext()
      }, edata: {type: 'content', mode: 'play', pageid: '', duration: Number((duration / 1e3).toFixed(2))}}
      );
    this.pdfLastPageTime = this.pdfPlayerStartTime = new Date().getTime();
    document.getElementById('viewerContainer').onscroll = (e: any) => {
      if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {
        this.raiseEndEvent();
        this.viewState = 'end';
      }
      if (e.target.scrollTop < 10) {
         this.currentPagePointer = (window as any).PDFViewerApplication.page;
         this.raiseHeartBeatEvent('PAGE_CHANGE');
      }
    };
  }

  raiseEndEvent() {
    const duration  = new Date().getTime() - this.pdfPlayerStartTime;
    const durationSec = Number((duration / 1e3).toFixed(2));
    const endEvent =  {
      eid: 'END',
      ver: this.version,
      edata: {
        type: 'END',
        currentPage: this.currentPagePointer,
        totalPages: this.totalNumberOfPages,
        duration
      },
      metaData: this.metaData
    };
    this.playerEvent.emit(endEvent);
    const visitedlength = (this.metaData.pagesHistory.filter((v, i, a) => a.indexOf(v) === i)).length;

    CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
      edata: {
        type: 'content',
        mode: 'play',
        pageid: 'sunbird-player-Endpage',
        summary: [
          {
            progress: Number(((this.currentPagePointer / this.totalNumberOfPages) * 100).toFixed(0))
          },
          {
            totallength: this.totalNumberOfPages
          },
          {
            visitedlength
          },
          {
            visitedcontentend: (this.currentPagePointer === this.totalNumberOfPages)
          },
          {
            totalseekedlength: this.totalNumberOfPages - visitedlength
          },
          {
            endpageseen: (this.currentPagePointer === this.totalNumberOfPages)
          }
        ],
        duration: durationSec
      },
      options: {
        object: this.telemetryObject,
        context: this.getEventContext()
      }
    });
    this.getTimeSpentForUI();
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
    CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
      edata: {
        err: 'LOAD',
        errtype: 'content',
        stacktrace: (error && error.toString()) || ''
      }
    });
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
    if (type === 'PAGE_CHANGE') {
      CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
        options: {
          object: this.telemetryObject,
          context: this.getEventContext()
        },
        edata: {type: 'workflow', subtype: '', pageid: this.currentPagePointer + '', uri: ''}
      });
    }

    const interactItems = ['CLOSE_DOWNLOAD', 'DOWNLOAD', 'ZOOM_IN',
    'ZOOM_OUT', 'NAVIGATE_TO_PAGE',
    'NEXT_PAGE', 'OPEN_MENU', 'PREVIOUS_PAGE', 'CLOSE_MENU', 'DOWNLOAD_MENU',
    'SHARE'
  ];
    if (interactItems.includes(type)) {
      this.raiseInteractEvent(type.toLowerCase());
    }

  }

  public raiseInteractEvent(id) {
    CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
      options: {
        object: this.telemetryObject,
        context: this.getEventContext()
      },
      edata: {type: 'TOUCH', subtype: '', id, pageid: this.currentPagePointer + ''}
    });
  }

  public getTimeSpentForUI() {
    const duration = new Date().getTime() - this.pdfPlayerStartTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Number(((duration % 60000) / 1000).toFixed(0));
    this.timeSpent =  minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  private  uniqueId(length = 32 ) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 replayContent() {
  this.raiseHeartBeatEvent('REPLAY');
 }

 private getEventContext() {
  const eventContextData = {
    channel:  this.context.channel,
    pdata: this.context.pdata,
    env: 'ContentPlayer',
    sid: this.context.sid,
    uid: this.context.uid,
    cdata: [{id: this.contentSessionId, type: 'ContentSession'},
    {id: this.playSessionId, type: 'PlaySession'}],
    rollup: this.context.contextRollup || {}
  };
  return eventContextData;
}

}
