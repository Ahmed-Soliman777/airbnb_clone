import { TestBed } from '@angular/core/testing';

import { AdminPayments } from './admin-payments';

describe('AdminPayments', () => {
  let service: AdminPayments;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPayments);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
