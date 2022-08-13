import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let req = this.addToken(request, environment.witApiToken);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse)  => throwError(() => new Error(error.message))
    ));
  }

  private addToken(request: HttpRequest<any>, token: string) {
    const headers = request.headers.append(
      'Authorization', `Bearer ${token}`
    );

    return request.clone({ headers });
  }
}
