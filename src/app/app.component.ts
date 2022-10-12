import { Component, OnInit } from '@angular/core';
import { PlayerConfig, Metadata } from '../../projects/sunbird-pdf-player/src/lib/playerInterfaces';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sunbird-pdf-player-app';
  pdfMetaDataConfig: any = JSON.parse(localStorage.getItem('config')) || {};
  config = {
    ...{
      traceId: 'afhjgh',
      sideMenu: {
        showShare: true,
        showDownload: true,
        showReplay: true,
        showExit: true
      }
    }, ...this.pdfMetaDataConfig
  };
  metadata: Metadata = {
    compatibilityLevel: 4,
    artifactUrl: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31291455031832576019477/b301b302_std_1_tamilenglish_lang_term-1_opt.pdf',
    identifier: 'do_31291455031832576019477',
    name: 'B301,B302_STD_1_TAMIL,ENGLISH_LANG_TERM 1_OPT',
    streamingUrl: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31291458881611366418883/b331332333_std_5_mathssciencesocial_tm_term-1_opt.pdf',
    pkgVersion: 1
  };
  pdfMetadataEvents: object;
  pdfPlayerConfig: PlayerConfig = {
    context: {
      channel: '505c7c48ac6dc1edc9b08f21db5a571d',
      pdata: { id: 'prod.diksha.portal', ver: '3.2.12', pid: 'sunbird-portal' },
      dispatcher: {
        dispatch(event) {
          console.log(`Events from dispatcher: ${JSON.stringify(event)}`);
        }
      }
    },
    config: this.config,
    metadata: this.metadata
  };

  ngOnInit(): void {
  }



  pdfEventHandler(event) {

    console.log(JSON.stringify(event));
    this.pdfMetadataEvents = event;
    if (event.eid === 'END') {
      this.pdfMetaDataConfig = event.metaData;
      localStorage.setItem('config', JSON.stringify(this.pdfMetaDataConfig));
      this.pdfMetaDataConfig = JSON.parse(localStorage.getItem('config')) || {};
      this.config = {
        ...{
          traceId: 'afhjgh',
          sideMenu: {
            showShare: true,
            showDownload: true,
            showReplay: true,
            showExit: true
          }
        }, ...this.pdfMetaDataConfig
      };
      this.pdfPlayerConfig.config = this.config;
    }

    if (event?.edata?.type === 'PRINT') {
      const windowFrame = window.document.querySelector('pdf-viewer iframe');
      if (windowFrame) {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        windowFrame['contentWindow'].print();
      }
    }
  }
  telemetryEvent(event) {
    console.log('in app: ', JSON.stringify(event));
  }

}
