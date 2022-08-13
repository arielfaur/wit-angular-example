import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, ReplaySubject, Subscription, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiConfiguration } from '../config/api.config';
import { Message, WitMessage } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {

  public readonly q$ = new BehaviorSubject<string | null>(null); // cache last sent message
  public readonly message$ = new ReplaySubject<Message>(50); // cache last 50 received messages

  private chatSubscription: Subscription;

  constructor(private http: HttpClient) { 
    this.chatSubscription = this.q$.pipe(
      switchMap(q => {
        if (q !== '' && q !== null) {
          return this.send(q).pipe(
            tap(res => this.message$.next(res))
          );
        } else {
          return of(null)
        }
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.chatSubscription.unsubscribe();
  }

  query(q: string) {
    const message: Message = {
      type: 'outgoing',
      payload: q
    }
    this.message$.next(message);

    this.q$.next(q);
  }

  private send(q: string): Observable<Message> {
    return this.http.get<WitMessage>(`${environment.witApiHost + ApiConfiguration.wit.message}?v=${environment.witApiVersion}&q=${encodeURIComponent(q)}`).pipe(
      map(payload => {  
        return {
          type: 'incoming',
          payload
        } as Message
      }),
      catchError((error) => throwError(() => error))
    );
  }
}
