import { TestBed } from '@angular/core/testing';

import { DetalleventaService } from './detalleventa.service';

describe('DetalleventaService', () => {
  let service: DetalleventaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleventaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
