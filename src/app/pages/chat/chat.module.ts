import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatModule } from '../../shared/mat.module';
import { SocketWithToken } from '../../shared/socket-with-token';
import { MessagesComponent } from './messages/messages.component';
import { MessagesService } from './messages/messages.service';
import { MessagesStore } from '../../store/messages.store';
import { ScrollDirective } from '../../directives/scroll.directive';
import { UsersComponent } from './users/users.component';
import { UsersService } from './users/users.service';
import { ColorsService } from './users/colors.service';

@NgModule({
  declarations: [
    ChatComponent,
    MessagesComponent,
    ScrollDirective,
    UsersComponent,
  ],
  imports: [CommonModule, FormsModule, MatModule, ReactiveFormsModule],
  providers: [
    ChatService,
    UsersService,
    ColorsService,
    MessagesService,
    SocketWithToken,
    MessagesStore,
  ],
})
export class ChatModule {}
