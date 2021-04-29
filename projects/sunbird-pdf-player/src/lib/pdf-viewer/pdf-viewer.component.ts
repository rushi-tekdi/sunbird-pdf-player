import { AfterViewInit, Component, ElementRef, 
  Renderer2, ViewChild, OnDestroy, EventEmitter,
   Output, Input } from '@angular/core';
import { ViewerService } from '../services/viewer.service';
@Component({
  selector: 'pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements AfterViewInit, OnDestroy {

  public src = './../assets/pdfjs/web/viewer.html?file=';
  @ViewChild('iframe', {static: true}) iframeRef: ElementRef;
  @Input() pdfURL: string;
  @Input() actions = new EventEmitter<any>();
  private unListenLoadEvent: () => void;
  private progressInterval;
  private isRegisteredForEvents = false;
  private viewerApp;
  private iframeWindow;
  @Output() viewerEvent = new EventEmitter<any>();
  private actionsMap = new Map([
    ['ZOOM_OUT', 'zoomout'],
    ['NEXT', 'nextpage'],
    ['PREVIOUS', 'previouspage'],
    ['ROTATE_CW', 'rotatecw'],
    ['DOWNLOAD', 'download']
  ])

  constructor(private renderer: Renderer2,  private viewerService: ViewerService) { }

  ngAfterViewInit() {
    this.iframeRef.nativeElement.src = 
    `${this.src}${this.pdfURL}#pagemode=none&page=${this.viewerService.currentPagePointer}&zoom=${this.viewerService.zoom}`;
    this.unListenLoadEvent = this.renderer.listen(this.iframeRef.nativeElement, 'load', () => {

      this.iframeWindow = this.iframeRef.nativeElement.contentWindow;
      this.viewerApp = this.iframeWindow.PDFViewerApplication;

      let progress, loadingPromiseCheck = false;
      this.progressInterval = setInterval(() => {
        if (this.viewerApp && (progress !== this.viewerApp.loadingBar.percent || this.viewerApp.loadingBar.percent === 100)) {
          progress = this.viewerApp.loadingBar.percent;
          this.viewerEvent.emit({ type: 'progress', data: this.viewerApp.loadingBar.percent });
        }
        if ( this.viewerApp && 
          this.viewerApp.eventBus &&
          this.viewerApp.eventBus.on &&
          !this.isRegisteredForEvents) {
          this.registerForEvents();
        }
        if ( this.viewerApp && 
          this.viewerApp.pdfLoadingTask &&
          this.viewerApp.pdfLoadingTask.promise &&
          !loadingPromiseCheck) {
            this.viewerApp.pdfLoadingTask.promise.catch((error) => {
              
              this.viewerEvent.emit({ type: 'error', data:  
              (navigator.onLine ?  `Internet available but unable to fetch the url ${this.pdfURL} ` : `No internet to load pdf with url ${this.pdfURL} `)  + (error ? error.toString() : '' )  });
            });
            loadingPromiseCheck = true;
          }
      }, 100);
    });

    this.actions.subscribe(({ type, data }) => {
      if (type === 'REPLAY') {
        this.iframeRef.nativeElement.contentDocument.location.reload(true);
        this.isRegisteredForEvents = false;
      } else if (type === 'ZOOM_IN' && this.viewerApp.pdfViewer.currentScale < 3) {
        this.viewerService.pageSessionUpdate();
        this.viewerApp.zoomIn();
        this.viewerService.zoom = (this.viewerApp.pdfViewer.currentScale * 100)
      }
      else if (type === 'ZOOM_OUT') {
        this.viewerService.pageSessionUpdate();
        this.viewerApp.zoomOut();
        this.viewerService.zoom = (this.viewerApp.pdfViewer.currentScale * 100)
      } else if (type === 'NAVIGATE_TO_PAGE') {
        this.viewerEvent.emit({ type: 'INVALID_PAGE_ERROR', data: true })
        this.viewerApp.page = data;
      } else if (this.actionsMap.has(type)) {
        this.viewerApp.eventBus.dispatch(this.actionsMap.get(type));
      } else if (type === 'INVALID_PAGE_ERROR') {
        this.viewerEvent.emit({ type: 'INVALID_PAGE_ERROR', data: false });
      }
    });
  }


  registerForEvents() {
    this.isRegisteredForEvents = true;
    if (this.iframeWindow.PDFViewerApplication) {
      this.viewerApp.eventBus.on('pagesloaded', (data) => {
        setTimeout(() => {
          this.viewerApp.rotatePages(this.viewerService.rotation);
        },500)
        this.pagesLoadedCallback(data);
      });
      this.viewerApp.eventBus.on('pagechanging', (data) => {
        this.viewerEvent.emit({ type: 'pagechanging', data });
      });

      this.viewerApp.eventBus.on('rotatecw', () => {
        this.viewerEvent.emit({ type: 'rotatecw', data: this.viewerApp.pdfViewer.pagesRotation });
      });
    }
    
    this.ListenToPageScroll();
  }

  private pagesLoadedCallback(data: any) {
    this.viewerEvent.emit({ type: 'progress', data: 100 });
    clearInterval(this.progressInterval);
    this.viewerApp.pdfViewer.pagesRotation = 0;
    this.viewerApp.pdfViewer.currentScaleValue = 'page-width';
    this.viewerEvent.emit({ type: 'pagesloaded', data });
  }

  private ListenToPageScroll() {
    this.iframeWindow.document.getElementById('viewerContainer').onscroll = (e: any) => {
      if (Math.ceil(e.target.offsetHeight + e.target.scrollTop) >= e.target.scrollHeight && this.viewerService.totalNumberOfPages > 1) {
        this.viewerEvent.emit({ type: 'pageend' });
      }
    };
  }

  ngOnDestroy() {
    this.unListenLoadEvent();
  }
}
