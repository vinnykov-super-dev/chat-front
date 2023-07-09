import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAuthUser } from '../models/auth-user.model';
import { IMessage } from '../models/message.model';
@Injectable({
  providedIn: 'root',
})
export class MessagesStore {
  public messages$: BehaviorSubject<IMessage[]> = new BehaviorSubject<
    IMessage[]
      >([]);
    
    public get messages(): IMessage[] {
        return this.messages$.getValue();
    }
}
