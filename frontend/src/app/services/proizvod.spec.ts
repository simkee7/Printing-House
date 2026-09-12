import { TestBed } from '@angular/core/testing';

import { ProizvodService } from './proizvod';

describe('ProizvodService', () => {
  let service: ProizvodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProizvodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
