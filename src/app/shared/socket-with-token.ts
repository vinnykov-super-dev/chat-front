import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketWithToken extends Socket {
  public socketId!: string;

  constructor() {
    super({
      url: 'http://localhost:3333',
      options: {
        transports: ['websocket', 'polling'],
        query: {
          token: (() => localStorage.getItem('token'))(),
        },
      },
    });
  }

  public newConnection(): void {
    this.ioSocket.io.opts.query.token = localStorage.getItem('token');
    super.connect();
  }

  public destroyConnection(): void {
    this.ioSocket.io.opts.query.token = null;
    this.disconnect();
  }
}
