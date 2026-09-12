import { TestBed } from '@angular/core/testing';

import { NabavkaService } from './nabavka';

describe('NabavkaService', () => {
  let service: NabavkaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NabavkaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
