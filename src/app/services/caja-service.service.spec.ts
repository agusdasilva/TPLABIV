import { TestBed } from '@angular/core/testing';

import { CajaServiceService } from './caja-service.service';

describe('CajaServiceService', () => {
  let service: CajaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CajaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
