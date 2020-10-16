import { AfterViewInit, Component, ElementRef, 
  Renderer2, ViewChild, OnDestroy, EventEmitter,
   Output, Input } from '@angular/core';
@Component({
  selector: 'pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements AfterViewInit, OnDestroy {

  public src = './../assets/pdfjs/web/viewer.html?file=';
  @ViewChild('iframe') iframeRef: ElementRef;
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

  constructor(private renderer: Renderer2) { }


  ngAfterViewInit() {
    this.iframeRef.nativeElement.src = `${this.src}${this.pdfURL}#pagemode=none`;
    this.unListenLoadEvent = this.renderer.listen(this.iframeRef.nativeElement, 'load', () => {
      this.iframeWindow = this.iframeRef.nativeElement.contentWindow;
      this.viewerApp = this.iframeWindow.PDFViewerApplication;
      let progress;
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
      }, 100);
    });

    this.actions.subscribe(({ type, data }) => {
      if (type === 'REPLAY') {
        this.iframeRef.nativeElement.contentDocument.location.reload(true);
        this.isRegisteredForEvents = false;
      } else if (type === 'ZOOM_IN' && this.viewerApp.pdfViewer.currentScale < 3) {
          this.viewerApp.zoomIn();
      } if (type === 'NAVIGATE_TO_PAGE') {
        this.viewerApp.page = data;
      } else if (this.actionsMap.has(type)) {
        this.viewerApp.eventBus.dispatch(this.actionsMap.get(type));
      }
    });
  }

  registerForEvents() {
    this.isRegisteredForEvents = true;
    if (this.iframeWindow.PDFViewerApplication) {
      this.viewerApp.eventBus.on('pagesloaded', (data) => {
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
      if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {
        this.viewerEvent.emit({ type: 'pageend' });
      }
    };
  }

  ngOnDestroy() {
    this.unListenLoadEvent();
  }
}
