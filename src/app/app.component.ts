import { ChangeDetectorRef, Component, ElementRef, ViewChild, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap, debounceTime } from 'rxjs/operators';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  text!: string;
  @ViewChild('content') private content!: ElementRef;
  private chatSubscription!: Subscription;

  constructor(private chatService: ChatService, changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // subscribes to chat service to update scroll position when a new message arrives
    this.chatSubscription = this.chatService.message$.pipe(
      debounceTime(300),
      tap(() => this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.chatSubscription.unsubscribe();
  }

  send() {
    if (!this.text) {
      return;
    }
    this.chatService.query(this.text);
    this.text = '';
  }
}
