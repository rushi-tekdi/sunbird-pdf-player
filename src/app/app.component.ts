import { Component } from '@angular/core';
import { PdfComponentInput } from 'sunbird-pdf-player/lib/playerInterfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sunbird-pdf-player-app';
  pdfMetadataEvents: object;
  pdfPlayerConfig: PdfComponentInput = {
    src: 'https://raw.githubusercontent.com/mozilla/pdf.js-sample-files/master/tracemonkey.pdf',
    startFromPage: 140
};

pdfEventHandler(valueEmitted) {
  console.log(JSON.stringify(valueEmitted));
  this.pdfMetadataEvents = valueEmitted;
}
}
