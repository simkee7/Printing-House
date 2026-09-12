import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { pravnoLiceGuard } from './pravno-lice-guard';

describe('pravnoLiceGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => pravnoLiceGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
