import { TestBed } from '@angular/core/testing';

import { BrowseService } from './browse.service';

describe('BrowseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrowseService = TestBed.get(BrowseService);
    expect(service).toBeTruthy();
  });
});
