import { Injector, NgModule, NgZone } from '@angular/core';
import { exposeToken } from './ngx-parent-injector-helpers';

@NgModule()
export class NgxParentInjectorModule {
  public constructor(injector: Injector) {
    exposeToken(NgZone);
    if (!window.ngxParentInjector?.parentInjector) {
      window.ngxParentInjector = {
        ...(window.ngxParentInjector || {}),
        parentInjector: injector,
      };
    }
  }
}
