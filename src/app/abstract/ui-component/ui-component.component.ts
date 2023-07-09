import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class UiComponent implements OnDestroy {
  protected readonly notifier$ = new Subject<void>();

  public ngOnDestroy(): void {
    this.notifier$.next();
  }
}