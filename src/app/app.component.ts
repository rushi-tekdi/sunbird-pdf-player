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
    // tslint:disable-next-line:max-line-length
    src: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31291455031832576019477/b301b302_std_1_tamilenglish_lang_term-1_opt.pdf',
    startFromPage: 10,
    backgroundColor: '#ffffff',
    height: '100%'
};

pdfEventHandler(valueEmitted) {
  console.log(JSON.stringify(valueEmitted));
  this.pdfMetadataEvents = valueEmitted;
}
}
