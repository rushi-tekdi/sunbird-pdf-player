import { EventEmitter, Injectable } from '@angular/core';
import { PlayerConfig } from '../playerInterfaces';
import { SunbirdPdfPlayerService } from '../sunbird-pdf-player.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class ViewerService {

  public zoom: any = 'auto';
  public rotation = 0;
  public currentPagePointer = 0;
  public totalNumberOfPages = 0;
  public pdfPlayerStartTime: number;
  public pdfLastPageTime: number;
  public endPageSeen = false;
  public timeSpent = '0:0';
  private version = '1.0';
  public playerEvent = new EventEmitter<any>();
  public contentName: string;
  public loadingProgress: number;
  public showDownloadPopup: boolean;
  public src: string;
  public userName: string;
  private metaData: any;

  constructor(private sunbirdPdfPlayerService: SunbirdPdfPlayerService,
    private utilService: UtilService) { }

  initialize({ context, config, metadata }: PlayerConfig) {
    this.zoom = config.zoom || 'auto';
    this.rotation = config.rotation ||  0;
    this.pdfPlayerStartTime = this.pdfLastPageTime = new Date().getTime();
    this.totalNumberOfPages = 0;
    this.currentPagePointer = (config && config.startFromPage) || 1;
    this.contentName = metadata.name;
    if(metadata.isAvailableLocally) {
      const basePath = (metadata.streamingUrl) ? (metadata.streamingUrl) : (metadata.basePath || metadata.baseDir)
      this.src = `${basePath}/${metadata.artifactUrl}`;
    } else {
      this.src =  metadata.streamingUrl || metadata.artifactUrl;
    }
    if (context.userData) {
      const { userData: { firstName, lastName } } = context;
      this.userName = firstName === lastName ? firstName : `${firstName} ${lastName}`;
    }
    this.metaData = {
      pagesVisited: [],
      totalPages: 0,
      duration: [],
      zoom: [],
      rotation: []
    };
    this.loadingProgress = 0;
    this.showDownloadPopup = false;
    this.endPageSeen = false;

  }

  defaultConfig = {
    startFromPage: 1,
    zoom: this.zoom,
    rotation: this.rotation
  };


  public pageSessionUpdate() {
    this.metaData.pagesVisited.push(this.currentPagePointer);
    this.metaData.duration.push(new Date().getTime() - this.pdfLastPageTime);
    this.metaData.zoom.push(this.zoom);
    this.metaData.rotation.push(this.rotation);
    this.pdfLastPageTime = new Date().getTime();
  }

  raiseStartEvent(event) {
    this.currentPagePointer = this.currentPagePointer > event.pagesCount ? 1 : this.currentPagePointer,
      this.metaData.totalPages = event.pagesCount;
    this.totalNumberOfPages = event.pagesCount;
    const duration = new Date().getTime() - this.pdfPlayerStartTime;
    const startEvent = {
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
    this.pdfLastPageTime = this.pdfPlayerStartTime = new Date().getTime();
    this.sunbirdPdfPlayerService.start(duration);
  }

  raiseEndEvent() {
    this.pageSessionUpdate();
    const duration = new Date().getTime() - this.pdfPlayerStartTime;
    const endEvent = {
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
    const visitedlength = (this.metaData.pagesVisited.filter((v, i, a) => a.indexOf(v) === i)).length;
    this.timeSpent = this.utilService.getTimeSpentText(this.pdfPlayerStartTime);
    this.sunbirdPdfPlayerService.end(duration,
      this.currentPagePointer, this.totalNumberOfPages, visitedlength, this.endPageSeen);
  }


  raiseHeartBeatEvent(type: string) {
    const hearBeatEvent = {
      eid: 'HEARTBEAT',
      ver: this.version,
      edata: {
        type,
        currentPage: this.currentPagePointer
      },
      metaData: this.metaData
    };
    this.playerEvent.emit(hearBeatEvent);
    this.sunbirdPdfPlayerService.heartBeat(hearBeatEvent);
    if (type === 'PAGE_CHANGE') {
      this.sunbirdPdfPlayerService.impression(this.currentPagePointer); 
    }
    const interactItems = ['CLOSE_DOWNLOAD', 'DOWNLOAD', 'ZOOM_IN',
      'ZOOM_OUT', 'NAVIGATE_TO_PAGE',
      'NEXT', 'OPEN_MENU', 'PREVIOUS', 'CLOSE_MENU', 'DOWNLOAD_MENU',
      'SHARE', 'ROTATION_CHANGE', 'REPLAY' , 'PRINT'
    ];
    if (interactItems.includes(type)) {
      this.sunbirdPdfPlayerService.interact(type.toLowerCase(), this.currentPagePointer);
    }

  }

  raiseErrorEvent(error: Error, type?: string) {
    const errorEvent = {
      eid: 'ERROR',
      ver: this.version,
      edata: {
        type: type || 'ERROR',
        stacktrace: error ? error.toString() : ''
      },
      metaData: this.metaData
    };
    this.playerEvent.emit(errorEvent);
    if (!type) {
    this.sunbirdPdfPlayerService.error(error);
    }
  }

  raiseExceptionLog(errorCode: string , errorType: string , stacktrace , traceId ) {
    const exceptionLogEvent = {
      eid: "ERROR",
      edata: {
          err: errorCode,
          errtype: errorType,
          requestid: traceId || '',
          stacktrace: stacktrace || '',
      }
    }
    this.playerEvent.emit(exceptionLogEvent)
    this.sunbirdPdfPlayerService.error(stacktrace, { err: errorCode, errtype: errorType });
  }
}
