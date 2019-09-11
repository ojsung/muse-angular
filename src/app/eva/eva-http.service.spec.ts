import { TestBed } from '@angular/core/testing';

import { EvaHttpService } from './eva-http.service';

describe('EvaHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvaHttpService = TestBed.get(EvaHttpService);
    expect(service).toBeTruthy();
  });
});
