import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IUser } from '../../../models/user.model';
import { AuthUserStore } from '../../../store/auth-user.store';
import { UsersStore } from '../../../store/users.store';
import { AuthService } from '../../auth/auth.service';
import { ColorsService } from './colors.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class UsersSubscriptionsService {
  constructor(
    private usersService: UsersService,
    private usersStore: UsersStore,
    private authUserStore: AuthUserStore,
    private authService: AuthService,
    private router: Router,
    private colorsService: ColorsService,
    private snackBar: MatSnackBar
  ) {}
  private isAdmin = this.authUserStore.authUser?.role === 'admin';
  private users$ = this.usersStore.users$;
  private get users(): IUser[] {
    return this.users$.getValue();
  }

  private userLeftSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userLeft()
      .pipe(takeUntil(notifier$))
      .subscribe((user) => {
        let users;

        if (this.isAdmin) {
          users = this.users.map((u) =>
            u.id === user.id ? { ...u, online: false } : u
          );
        } else {
          users = this.users.filter((u) => u.id !== user.id);
        }

        this.users$.next(users);
      });
  }

  private userJoinedSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userJoined()
      .pipe(takeUntil(notifier$))
      .subscribe((user) => {
        const userExists = !!this.users.find((u) => u.id === user.id);

        if (this.isAdmin && userExists) {
          this.users$.next(
            this.users.map((u) =>
              u.id === user.id ? { ...u, online: true } : u
            )
          );
          return;
        }

        if (this.isAdmin && !userExists) {
          this.users$.next([
            { ...user, color: this.colorsService.getColor(), online: true },
            ...this.users,
          ]);
          return;
        }

        this.users$.next([
          { ...user, color: this.colorsService.getColor() },
          ...this.users,
        ]);
      });
  }

  private muteSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userMuted()
      .pipe(takeUntil(notifier$))
      .subscribe((id) => {
        const user = this.users.find((u) => u.id === id);

        if (user?.id === this.authUserStore.id) {
          this.openSnackBar(`You've been muted`);
        }

        this.users$.next(
          this.users.map((u) => (u.id === id ? { ...u, muted: true } : u))
        );
      });
  }

  private unmuteSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userUnmuted()
      .pipe(takeUntil(notifier$))
      .subscribe((id) => {
        const user = this.users.find((u) => u.id === id);

        if (user?.id === this.authUserStore.id) {
          this.openSnackBar(`You've been unmuted`);
        }

        this.users$.next(
          this.users.map((u) => (u.id === id ? { ...u, muted: false } : u))
        );
      });
  }

  private banSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userBanned()
      .pipe(takeUntil(notifier$))
      .subscribe((id) => {
        const user = this.users.find((u) => u.id === id);
        const isCurrentUser = user?.id === this.authUserStore.id;

        if (user) {
          const message = isCurrentUser
            ? 'You have been banned'
            : `${user?.username} has been banned`;

          this.openSnackBar(message);
        }

        if (this.isAdmin) {
          const users = this.users.map((u) =>
            u.id === id ? { ...u, banned: true, online: false } : u
          );

          this.users$.next(users);
        }

        if (!this.isAdmin) {
          this.users$.next(this.users.filter((u) => u.id !== id));
        }

        if (isCurrentUser) {
          this.authService.logout();
          this.router.navigateByUrl('/auth/login');
          this.usersService.disconnectUser(id);
        }
      });
  }

  private unbanSubcription(notifier$: Subject<void>): void {
    this.usersService
      .userUnbanned()
      .pipe(takeUntil(notifier$))
      .subscribe((id) => {
        this.users$.next(
          this.users.map((u) => (u.id === id ? { ...u, banned: false } : u))
        );
      });
  }

  private disconnectedSubscription(notifier$: Subject<void>): void {
    this.usersService
      .disconnected()
      .pipe(takeUntil(notifier$))
      .subscribe(() => {
        this.authService.logout();
        this.router.navigateByUrl('/auth/login');
      });
  }

  private anotherClientConnectionSubscription(notifier$: Subject<void>): void {
    this.usersService
      .anotherClientConnection()
      .pipe(takeUntil(notifier$))
      .subscribe(({ userId, clientId }) => {
        if (
          this.authUserStore.id === userId &&
          this.usersService.socketId === clientId
        ) {
          this.openSnackBar(`You've logged in with a different device`);
        }
      });
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, undefined, { duration: 3000 });
  }

  public subscribe(notifier$: Subject<void>): void {
    this.usersService.connect();

    this.userLeftSubcription(notifier$);
    this.userJoinedSubcription(notifier$);
    this.muteSubcription(notifier$);
    this.unmuteSubcription(notifier$);
    this.banSubcription(notifier$);
    this.unbanSubcription(notifier$);
    this.disconnectedSubscription(notifier$);
    this.anotherClientConnectionSubscription(notifier$);
  }
}
