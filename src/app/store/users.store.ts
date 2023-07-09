import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAuthUser } from '../models/auth-user.model';
import { IUser } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class UsersStore {
  public users$: BehaviorSubject<IUser[]> = new BehaviorSubject<IUser[]>([]);
}
