import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, OnDestroy, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit, OnDestroy {

  public src = './../assets/pdfjs/web/viewer.html?file=';
  @ViewChild('iframe') iframeRef: ElementRef;
  @Input() pdfURL: string;
  @Input() actions = new EventEmitter<any>();
  private unListenLoadEvent: () => void;
  private progressInterval;
  private isRegisteredForEvents = false;
  @Output()  viewerEvent = new EventEmitter<any>();

  constructor(private renderer: Renderer2 ) {
   }


  ngAfterViewInit() {
    this.iframeRef.nativeElement.src = `${this.src}${this.pdfURL}#pagemode=none`;
    this.unListenLoadEvent = this.renderer.listen(this.iframeRef.nativeElement, 'load', () => {
      const viewerApp: any = this.iframeRef.nativeElement.contentWindow.PDFViewerApplication;
      let progress;
      this.progressInterval =  setInterval(() => {
        if (viewerApp && (progress !== viewerApp.loadingBar.percent || viewerApp.loadingBar.percent === 100)) {
          progress = viewerApp.loadingBar.percent;
          this.viewerEvent.emit({type: 'progress', data: viewerApp.loadingBar.percent});
        }
        if (viewerApp && viewerApp.eventBus && viewerApp.eventBus.on && !this.isRegisteredForEvents) {
          this.registerForEvents();
        }
      }, 100);
    });

    this.actions.subscribe(({type, data}) => {
      const viewerApp: any = this.iframeRef.nativeElement.contentWindow.PDFViewerApplication;
      if (type === 'REPLAY') {
        this.iframeRef.nativeElement.contentDocument.location.reload(true);
        this.isRegisteredForEvents = false;
      } else if (type === 'ZOOM_IN') {
        if (viewerApp.pdfViewer.currentScale < 3) {
          viewerApp.zoomIn();
        }
      } else if (type === 'ZOOM_OUT') {
        viewerApp.zoomOut();
      } else if (type === 'NEXT') {
        viewerApp.eventBus.dispatch('nextpage');
      } else if (type === 'PREVIOUS') {
        viewerApp.eventBus.dispatch('previouspage');
      } else if (type === 'NAVIGATE_TO_PAGE') {
        viewerApp.page = data;
      } else if (type === 'ROTATE_CW') {
        viewerApp.eventBus.dispatch('rotatecw');
      } else if (type === 'DOWNLOAD') {
        viewerApp.download();
      }
    });
  }

  registerForEvents() {
    this.isRegisteredForEvents = true;
    if (this.iframeRef.nativeElement.contentWindow.PDFViewerApplication) {
      const viewerApp: any = this.iframeRef.nativeElement.contentWindow.PDFViewerApplication;
      // viewerApp.onError = (error: Error) => this.viewerEvent.emit({type: 'error', data: error});
      viewerApp.eventBus.on('pagesloaded', (data) => {
          this.viewerEvent.emit({type: 'progress', data: 100});
          clearInterval(this.progressInterval);
          viewerApp.pdfViewer.pagesRotation = 0;
          viewerApp.pdfViewer.currentScaleValue = 'page-width';
          this.viewerEvent.emit({type: 'pagesloaded', data});
        });
      viewerApp.eventBus.on('pagechanging', (data) => {
          this.viewerEvent.emit({type: 'pagechanging', data});
        });
    }

    this.iframeRef.nativeElement.contentWindow.document.getElementById('viewerContainer').onscroll = (e: any) => {
        if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {
          this.viewerEvent.emit({type: 'pageend'});
        }
      };
  }

  ngOnDestroy() {
    this.unListenLoadEvent();
  }
}
