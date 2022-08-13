import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Message, WitMessage } from '../../models/message.model';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {

  messages: Array<Message> = [];
  messageSubject$!: Observable<Message | null>;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.messageSubject$ = this.chatService.message$.pipe(
      tap(m => {
        if (m !== null) {
          console.log('New message arrived', m);
          this.messages.push(m);
        }
      })
    )
  }

  renderMessage(msg: Message) {
    if (msg.type === 'incoming') {
      return this.handleWitResponseMessage(msg.payload as WitMessage);
    } else {
      return msg.payload;
    }
  }

  private handleWitResponseMessage(msg: WitMessage) {
    if (!msg.intents || msg.intents.length < 1 || !msg.entities) {
      return `🤖  Sorry, it looks like I wasn't trained properly. Could you please rephrase your question?`;
    }

    const intent = msg.intents[0];
    const entities = Object.entries(msg.entities).map(([name, entities]) => entities[0]);
    if (entities.length === 0) {
      return `🤖  Sorry, I'm still missing some context :)`;
    } else {
      const response = entities[0].value;
      const role = entities[0].role;
      if (!response) {
        return `🤖  Sorry, I'm still missing some context :)`;
      }
      return this.formatResponse(role, response);
    }
  }

  private formatResponse(role: string, res: string) {
    if (role === 'datetime') {
      return new Date(res).toString();
    } else {
      return res;
    }
  }

}
