import { TestBed } from '@angular/core/testing';

import { AmpdRxStompService } from './ampd-rx-stomp.service';

describe('AmpdRxStompService', () => {
  let service: AmpdRxStompService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmpdRxStompService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
