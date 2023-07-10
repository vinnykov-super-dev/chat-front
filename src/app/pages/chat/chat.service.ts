import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketWithToken } from '../../shared/socket-with-token';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: SocketWithToken) {}
  public exception(): Observable<{ message: string }> {
    return this.socket.fromEvent<{ message: string }>('exception');
  }
}
