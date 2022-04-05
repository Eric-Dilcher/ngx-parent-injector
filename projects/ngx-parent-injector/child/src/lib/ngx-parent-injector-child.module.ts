import {
  ApplicationRef,
  Inject,
  ModuleWithProviders,
  NgModule,
  NgZone,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  getParentProviders,
  getParentToken,
} from './ngx-parent-injector-child-helpers';

export interface NgxParentInjectorChildModuleOptions {
  testMode?: boolean;
}

/**
 * @private
 * Internal module not meant to be consumed directly. Include `NgxParentInjectorChildModule.forRoot(...)` in your application.
 */
@NgModule()
export class NgxParentInjectorChildModuleInternal {
  private subscription = new Subscription();
  public constructor(
    ngZone: NgZone,
    @Inject(getParentToken(NgZone)) parentNgZone: NgZone,
    appRef: ApplicationRef
  ) {
    window.addEventListener('beforeunload', () => this.onBeforeUnload());

    // Whenever the parent window's ngZone would trigger change detection,
    // manually trigger change detection in the child window.
    this.subscription.add(
      parentNgZone.onMicrotaskEmpty.subscribe(() => {
        appRef.tick();
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

  private onBeforeUnload(): void {
    this.subscription.unsubscribe();
  }
}

export class NgxParentInjectorChildModule {
  /**
   *
   * @param options.testMode default: false. Set to true when running tests.
   */
  public static forRoot(
    options?: NgxParentInjectorChildModuleOptions
  ): ModuleWithProviders<NgxParentInjectorChildModuleInternal> {
    return {
      ngModule: NgxParentInjectorChildModuleInternal,
      providers: options?.testMode ? [] : getParentProviders(),
    };
  }
}
