import { Component, OnInit } from '@angular/core';
import { SunbirdPdfPlayerService } from '../sunbird-pdf-player.service';

@Component({
  selector: 'start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {

  constructor(public pdfPlayerService: SunbirdPdfPlayerService) { }

  ngOnInit() {
  }

}
