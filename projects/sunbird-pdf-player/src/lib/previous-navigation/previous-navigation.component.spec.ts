import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousNavigationComponent } from './previous-navigation.component';

describe('PreviousNavigationComponent', () => {
  let component: PreviousNavigationComponent;
  let fixture: ComponentFixture<PreviousNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
