import { TestBed } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('UtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtilService = TestBed.inject(UtilService);
    expect(service).toBeTruthy();
  });

  it('should return unique id', () => {
    const service: UtilService = TestBed.inject(UtilService);
    const id = service.uniqueId();
    expect(id).toBeDefined();
  });

  it('should return time spent text', () => {
    const service: UtilService = TestBed.inject(UtilService);
    const time = service.getTimeSpentText(10);
    console.log(time);
    expect(time).toBeDefined();
  });

});
