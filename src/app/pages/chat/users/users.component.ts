import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UiComponent } from '../../../abstract/ui-component/ui-component.component';
import { AuthUserStore } from '../../../store/auth-user.store';
import { UsersStore } from '../../../store/users.store';
import { AuthService } from '../../auth/auth.service';
import { ColorsService } from './colors.service';
import { UsersSubscriptionsService } from './users-subscriptions.service';
import { UsersService } from './users.service';

@Component({
  selector: 'chat-app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent extends UiComponent implements OnInit, OnDestroy {
  public isAdmin = this.authUserStore.authUser?.role === 'admin';
  public authUserId = this.authUserStore.id;
  public users$ = this.usersStore.users$;
  @ViewChild('drawer') public drawer!: MatSidenav;
  @Input() closeDrawer$!: Subject<void>;

  constructor(
    public authUserStore: AuthUserStore,
    private usersStore: UsersStore,
    private usersService: UsersService,
    private usersSubscriptions: UsersSubscriptionsService,
    private colorsService: ColorsService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.usersSubscriptions.subscribe(this.notifier$);
    this.closeDrawer$.pipe(takeUntil(this.notifier$)).subscribe(() => {
      this.drawer.close();
      this.cdRef.markForCheck();
    });
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.usersService.disconnect();
  }

  private async loadUsers(): Promise<void> {
    const users = this.isAdmin
      ? await this.usersService.getAllUsers()
      : await this.usersService.getOnlineUsers();

    this.usersStore.users$.next(
      users.map((u) => ({ ...u, color: this.colorsService.getColor() }))
    );
  }

  public muteUser(id: string): void {
    this.usersService.mute(id);
  }

  public async unmuteUser(id: string): Promise<void> {
    this.usersService.unmute(id);
  }

  public banUser(id: string): void {
    this.usersService.banUser(id);
  }

  public unbanUser(id: string): void {
    this.usersService.unbanUser(id);
  }

  public logOut(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
