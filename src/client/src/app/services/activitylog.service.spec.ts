import { TestBed, inject } from '@angular/core/testing';

import { ActivitylogService } from './activitylog.service';

describe('ActivitylogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActivitylogService]
    });
  });

  it('should be created', inject([ActivitylogService], (service: ActivitylogService) => {
    expect(service).toBeTruthy();
  }));
});
