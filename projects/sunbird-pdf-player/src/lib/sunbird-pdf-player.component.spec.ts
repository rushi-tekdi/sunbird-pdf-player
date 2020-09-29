import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SunbirdPdfPlayerComponent } from './sunbird-pdf-player.component';

describe('SunbirdPdfPlayerComponent', () => {
  let component: SunbirdPdfPlayerComponent;
  let fixture: ComponentFixture<SunbirdPdfPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SunbirdPdfPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SunbirdPdfPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
