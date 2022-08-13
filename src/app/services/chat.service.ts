import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Subject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiConfiguration } from '../config/api.config';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly q = new BehaviorSubject<string>('');
  message!: Subject<Message>;

  constructor(private http: HttpClient) { }

  send(q: string) {
    return this.http.get<any>(`${environment.witApiHost + ApiConfiguration.wit.message}?v=20220801&q=${encodeURIComponent(q)}`).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
