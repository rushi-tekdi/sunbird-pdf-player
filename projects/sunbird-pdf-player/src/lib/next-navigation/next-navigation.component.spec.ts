import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextNavigationComponent } from './next-navigation.component';

describe('NextNavigationComponent', () => {
  let component: NextNavigationComponent;
  let fixture: ComponentFixture<NextNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
