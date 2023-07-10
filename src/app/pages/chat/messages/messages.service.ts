import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { IMessage } from '../../../models/message.model';
import { SocketWithToken } from '../../../shared/socket-with-token';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private socket: SocketWithToken) {}
  public sendMessage(message: string): void {
    this.socket.emit('sendMessage', { message });
  }

  public getNewMessage(): Observable<IMessage> {
    return this.socket.fromEvent<IMessage>('newMessage');
  }

  public getAllMessages(): Promise<IMessage[]> {
    this.socket.emit('getAllMessages');

    return firstValueFrom(this.socket.fromEvent<IMessage[]>('allMessages'));
  }
}
