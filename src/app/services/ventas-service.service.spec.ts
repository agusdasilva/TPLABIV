import { TestBed } from '@angular/core/testing';

import { VentasServiceService } from './ventas-service.service';

describe('VentasServiceService', () => {
  let service: VentasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
