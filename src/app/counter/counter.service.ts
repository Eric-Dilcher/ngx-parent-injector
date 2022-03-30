import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Counter {
  private counterSubject = new BehaviorSubject(0);
  public counter$ = this.counterSubject.asObservable();

  public reset(): void {
    this.counterSubject.next(0);
  }

  public increment(): void {
    this.counterSubject.next(this.counterSubject.value + 1);
  }

  public add(num: number): void {
    this.counterSubject.next(this.counterSubject.value + num);
  }
}
