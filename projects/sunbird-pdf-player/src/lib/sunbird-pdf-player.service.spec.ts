import { TestBed } from '@angular/core/testing';

import { SunbirdPdfPlayerService } from './sunbird-pdf-player.service';

describe('SunbirdPdfPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SunbirdPdfPlayerService = TestBed.get(SunbirdPdfPlayerService);
    expect(service).toBeTruthy();
  });
});
