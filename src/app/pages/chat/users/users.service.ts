import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { IUser } from '../../../models/user.model';
import { SocketWithToken } from '../../../shared/socket-with-token';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public socketId!: string;

  constructor(private socket: SocketWithToken) {
    this.socket.on('connect', () => (this.socketId = this.socket.ioSocket.id));
  }

  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public mute(id: string): void {
    this.socket.emit('muteUser', id);
  }

  public userMuted(): Observable<string> {
    return this.socket.fromEvent<string>('userMuted');
  }

  public unmute(id: string): void {
    this.socket.emit('unmuteUser', id);
  }

  public userUnmuted(): Observable<string> {
    return this.socket.fromEvent<string>('userUnmuted');
  }

  public disconnected(): Observable<void> {
    return this.socket.fromEvent<void>('disconnect');
  }

  public banUser(id: string): void {
    this.socket.emit('banUser', id);
  }

  public userBanned(): Observable<string> {
    return this.socket.fromEvent<string>('userBanned');
  }

  public unbanUser(id: string): void {
    this.socket.emit('unbanUser', id);
  }

  public userUnbanned(): Observable<string> {
    return this.socket.fromEvent<string>('userUnbanned');
  }

  public getOnlineUsers(): Promise<IUser[]> {
    this.socket.emit('getOnlineUsers');
    return firstValueFrom(this.socket.fromEvent<IUser[]>('onlineUsers'));
  }

  public getAllUsers(): Promise<IUser[]> {
    this.socket.emit('getAllUsers');
    return firstValueFrom(this.socket.fromEvent<IUser[]>('allUsers'));
  }

  public userJoined(): Observable<IUser> {
    return this.socket.fromEvent<IUser>('userConnected');
  }

  public disconnectUser(id: string): void {
    this.socket.emit('disconnectUser', id);
  }

  public userLeft(): Observable<IUser> {
    return this.socket.fromEvent<IUser>('userDisconnected');
  }

  public anotherClientConnection(): Observable<{
    userId: string;
    clientId: string;
  }> {
    return this.socket.fromEvent<{ userId: string; clientId: string }>(
      'anotherClientConnection'
    );
  }
}
