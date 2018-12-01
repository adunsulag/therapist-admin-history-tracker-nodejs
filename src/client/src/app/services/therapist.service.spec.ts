import { TestBed, inject } from '@angular/core/testing';

import { TherapistService } from './therapist.service';

describe('TherapistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TherapistService]
    });
  });

  it('should be created', inject([TherapistService], (service: TherapistService) => {
    expect(service).toBeTruthy();
  }));
});
