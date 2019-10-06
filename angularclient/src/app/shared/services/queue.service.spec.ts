import { TestBed } from '@angular/core/testing';

import { QueueService } from './queue.service';

describe('QueueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueueService = TestBed.get(QueueService);
    expect(service).toBeTruthy();
  });
});
