import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { UiComponent } from '../../abstract/ui-component/ui-component.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'chat-app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent extends UiComponent implements OnInit, OnDestroy {
  public authForm!: FormGroup;
  public error!: string;
  public isLoading = false;
  public isSignUpMode = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.authForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      },
      { updateOn: 'blur' },
    );

    this.route.url.pipe(takeUntil(this.notifier$)).subscribe((url: UrlSegment[]) => (this.isSignUpMode = url[0].path === 'sign-up'));
  }

  public async handleSubmit(): Promise<void> {
    if (this.authForm.invalid) return;

    this.authForm.disable();
    this.error = '';
    this.isLoading = true;

    try {
      if (this.isSignUpMode) {
        await this.authService.signUp(this.authForm.getRawValue());
        this.router.navigateByUrl('/auth/login');
      } else {
        await this.authService.login(this.authForm.getRawValue());
        this.router.navigateByUrl('/chat');
      }

      this.isLoading = false;
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  private onCatchError(error: string): void {
    this.error = error;
    this.isLoading = false;
    this.authForm.enable();
    this.authForm.markAsUntouched();
  }
}
