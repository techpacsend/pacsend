import { TestBed } from '@angular/core/testing';

import { ApilinksService } from './apilinks.service';

describe('ApilinksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApilinksService = TestBed.get(ApilinksService);
    expect(service).toBeTruthy();
  });
});
