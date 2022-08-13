import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  text!: string;
  title = 'eboapp';
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  constructor(chatService: ChatService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change' , this._mobileQueryListener );
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener ('change', this._mobileQueryListener);
  }

  send() {}
}
