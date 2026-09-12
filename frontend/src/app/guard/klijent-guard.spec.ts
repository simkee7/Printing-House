import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { klijentGuard } from './klijent-guard';

describe('klijentGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => klijentGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
