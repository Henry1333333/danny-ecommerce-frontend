import { TestBed } from '@angular/core/testing';

import { IneiService } from './inei.service';

describe('IneiService', () => {
  let service: IneiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IneiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
