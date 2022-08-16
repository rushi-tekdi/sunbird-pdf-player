import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PdfViewerComponent } from './pdf-viewer.component';

describe('PdfViewerComponent', () => {
  let component: PdfViewerComponent;
  let fixture: ComponentFixture<PdfViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PdfViewerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#pagesLoadedCallback should emit viewerEvent', () => {
    // tslint:disable-next-line:no-string-literal
    component['progressInterval'] = 123;
    spyOn(component.viewerEvent, 'emit');
    spyOn(global, 'clearInterval');
    const data = {};
    // tslint:disable-next-line:no-string-literal
    component['pagesLoadedCallback']({});
    expect(component.viewerEvent.emit).toHaveBeenCalledWith({ type: 'progress', data: 100 });
    expect(component.viewerEvent.emit).toHaveBeenCalledWith({ type: 'pagesloaded', data });
  });
  it('#ngAfterViewInit and should define iframe', () => {
    component.ngAfterViewInit();
    component.src = 'anc.com';
    component.pdfURL = 'samplepdfcontent.doId.pdf';
    expect(component.iframeRef).toBeDefined();
  });
});
