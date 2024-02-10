import { TestBed } from '@angular/core/testing';

import { TipoentregaService } from './tipoentrega.service';

describe('TipoentregaService', () => {
  let service: TipoentregaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoentregaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
