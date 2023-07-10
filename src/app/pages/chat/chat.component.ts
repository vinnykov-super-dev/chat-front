import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { UiComponent } from '../../abstract/ui-component/ui-component.component';
import { SocketWithToken } from '../../shared/socket-with-token';
import { ChatService } from './chat.service';

@Component({
  selector: 'chat-app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent extends UiComponent implements OnInit, OnDestroy {
  public closeDrawer$ = new Subject<void>();
  constructor(
    private chatService: ChatService,
    private snackBar: MatSnackBar,
    private socket: SocketWithToken
  ) {
    super();
  }

  ngOnInit(): void {
    this.socket.newConnection();

    this.chatService
      .exception()
      .pipe(takeUntil(this.notifier$))
      .subscribe((exception) =>
        this.snackBar.open(exception.message, undefined, { duration: 3000 })
      );
  }

  public closeDrawer(): void {
    this.closeDrawer$.next();
  }

  public override ngOnDestroy(): void {
    this.socket.destroyConnection();
  }
}
