import { TestBed } from '@angular/core/testing';

import { ThemingService } from './theming.service';

describe('ThemingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThemingService = TestBed.get(ThemingService);
    expect(service).toBeTruthy();
  });
});
