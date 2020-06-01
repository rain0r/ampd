import { TestBed } from '@angular/core/testing';

import { ResponsiveCoverSizeService } from './responsive-cover-size.service';

describe('ResponsiveCoverSizeService', () => {
  let service: ResponsiveCoverSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponsiveCoverSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
