import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatModule } from '../../shared/mat.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AuthComponent],
  providers: [AuthService],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, MatModule, RouterModule],
})
export class AuthModule {}
