import { TestBed } from '@angular/core/testing';

import { TimeServiceUtilsService } from '../../utils/timeService/time-service-utils.service';

describe('TimeServiceUtilsService', () => {
  let service: TimeServiceUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeServiceUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
