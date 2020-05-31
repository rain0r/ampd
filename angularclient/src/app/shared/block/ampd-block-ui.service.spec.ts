import {TestBed} from '@angular/core/testing';

import {AmpdBlockUiService} from './ampd-block-ui.service';

describe('AmpdBlockUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmpdBlockUiService = TestBed.get(AmpdBlockUiService);
    expect(service).toBeTruthy();
  });
});
