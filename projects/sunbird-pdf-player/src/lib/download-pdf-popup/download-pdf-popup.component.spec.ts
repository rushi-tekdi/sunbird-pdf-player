import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPdfPopupComponent } from './download-pdf-popup.component';

describe('DownloadPdfPopupComponent', () => {
  let component: DownloadPdfPopupComponent;
  let fixture: ComponentFixture<DownloadPdfPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadPdfPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPdfPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
