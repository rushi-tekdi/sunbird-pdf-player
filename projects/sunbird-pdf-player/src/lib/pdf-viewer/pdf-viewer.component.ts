import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SunbirdPdfPlayerService } from '../sunbird-pdf-player.service';

@Component({
  selector: 'pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit {

  public src = './../assets/pdfjs/web/viewer.html?file=';
  @ViewChild('iframe') iframe: ElementRef;
  constructor(public pdfPlayerService: SunbirdPdfPlayerService ) { }


  ngAfterViewInit() {
    this.iframe.nativeElement.src = this.src + this.pdfPlayerService.src;
  }

  iframeLoadEvent() {
    this.iframe.nativeElement.contentDocument.body.style.backgroundColor = this.pdfPlayerService.config.backgroundColor;
  }

}
