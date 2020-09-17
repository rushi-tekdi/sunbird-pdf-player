import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'previous-navigation',
  templateUrl: './previous-navigation.component.html',
  styleUrls: ['./previous-navigation.component.scss']
})
export class PreviousNavigationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  prevSlide() {
    (window as any).PDFViewerApplication.eventBus.dispatch('previouspage');
  }
}
