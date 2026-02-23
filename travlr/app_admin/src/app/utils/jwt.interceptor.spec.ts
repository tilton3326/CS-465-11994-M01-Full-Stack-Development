import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtInterceptor } from './jwt.interceptor';  // ← uppercase J !
import { AuthenticationService } from '../services/authentication.service';

describe('JwtInterceptor (class-based)', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthenticationService>('AuthenticationService', [
      'isLoggedIn',
      'getToken',
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),   // ← required for class-based interceptors
        provideHttpClientTesting(),
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        // Alternatively: authInterceptProvider  (if you prefer using the exported constant)
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify(); // no unmatched requests
  });

  it('adds Authorization header when logged in and not auth endpoint', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('abc123-fake-token');

    httpClient.get('/api/users').subscribe();

    const req = httpTesting.expectOne('/api/users');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123-fake-token');

    req.flush({});
  });

  it('does NOT add header when not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);

    httpClient.get('/api/public').subscribe();

    const req = httpTesting.expectOne('/api/public');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });

  it('skips header for login endpoint even when logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('abc123-fake-token');

    httpClient.post('login', { email: 'test', password: '123' }).subscribe();

    const req = httpTesting.expectOne('login');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({ ok: true });
  });
});