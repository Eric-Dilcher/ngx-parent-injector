import { ChangeDetectorRef, NgZone, Inject, Directive, OnDestroy, HostListener } from "@angular/core";
import { Subscription } from "rxjs";

import { getParentToken } from "./ngx-parent-injector-child-helpers";

@Directive({
  selector: '[ngxParentInjectorChild]'
})
export class NgxParentInjectorChildDirective implements OnDestroy {
  private readonly subscription = new Subscription();

  public constructor(
      ngZone: NgZone,
      @Inject(getParentToken(NgZone)) parentNgZone: NgZone,
      private readonly changeDetectorRef: ChangeDetectorRef
  ) {
      // Whenever the parent window's ngZone would trigger change detection,
      // manually trigger change detection in the child window.
      this.subscription.add(
          parentNgZone.onMicrotaskEmpty.subscribe(() => {
              this.changeDetectorRef.detectChanges();
          })
      );
      // Whenever this child window's ngZone would trigger change detection,
      // trigger another run of the parent window's ngZone. This will trigger
      // change detection in the parent window, but it will also trigger change
      // detection in all other child windows too. Using the parent window's
      // changeDetectorRef here would not propagate changes to other child windows.
      this.subscription.add(
          ngZone.onMicrotaskEmpty.subscribe(() => {
              parentNgZone.run(() => {});
          })
      );
  }

  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
