import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAuthUser } from '../models/auth-user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthUserStore {
  public authUser$: BehaviorSubject<IAuthUser | null> =
    new BehaviorSubject<IAuthUser | null>(null);

  public get id(): string | undefined {
    return this.authUser$.getValue()?.id;
  }

  public get authUser(): IAuthUser | null {
    return this.authUser$.getValue();
  }
}
