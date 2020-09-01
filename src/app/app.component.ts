import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sunbird-pdf-player-app';
  pdfMetadataEvents: object;
  pdfPlayerConfig = {
    src: 'https://raw.githubusercontent.com/mozilla/pdf.js-sample-files/master/tracemonkey.pdf'
};

pdfEventHandler(valueEmitted) {
  console.log(valueEmitted);
  this.pdfMetadataEvents = valueEmitted;
  localStorage.setItem('lastPageVisited', this.pdfMetadataEvents['metaData']['currentPagePointer']);
}
}
