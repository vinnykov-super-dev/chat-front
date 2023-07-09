import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, firstValueFrom, tap } from 'rxjs';
import { IAuthUser } from '../../models/auth-user.model';
import { IUserAuthData } from '../../models/user-auth-data.model';
import { AuthUserStore } from '../../store/auth-user.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private authUserStore: AuthUserStore) {}

  public signUp(data: IUserAuthData): Promise<void> {
    return firstValueFrom(
      this.http
        .post<void>(`${environment.apiUrl}/user`, data)
        .pipe(catchError(this.handleError))
    );
  }

  public login(data: IUserAuthData): Promise<IAuthUser> {
    return firstValueFrom(
      this.http
        .post<IAuthUser>(`${environment.apiUrl}/auth/login`, data)
        .pipe(tap(this.handleAuth.bind(this)), catchError(this.handleError))
    );
  }

  private handleAuth(data: IAuthUser): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    this.authUserStore.authUser$.next(data);
  }

  public autoLogin(): void {
    const userData = localStorage.getItem('user');

    if (userData) {
      this.authUserStore.authUser$.next(JSON.parse(userData));
    }
  }

  public logout(): void {
    localStorage.clear();
    this.authUserStore.authUser$.next(null);
  }

  private handleError(error: HttpErrorResponse): Promise<never> {
    let errorMessage = 'An unknown error occured...';

    if (error && error.error.message) {
      errorMessage = Array.isArray(error.error.message)
        ? error.error.message.join(', ')
        : error.error.message;
    }

    return Promise.reject(errorMessage);
  }
}
