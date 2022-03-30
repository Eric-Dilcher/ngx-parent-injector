import { ModuleWithProviders, NgModule } from '@angular/core';
import { getParentProviders } from './ngx-parent-injector-child-helpers';
import { NgxParentInjectorChildDirective } from './ngx-parent-injector-child.directive';

export interface NgxParentInjectorChildModuleOptions {
  testMode?: boolean
}

/**
 * @private
 * Internal module not meant to be consumed directly. Include `NgxParentInjectorChildModule.forRoot(...)` in your application.
 */
@NgModule({
  declarations: [NgxParentInjectorChildDirective],
  exports: [NgxParentInjectorChildDirective]
})
export class NgxParentInjectorChildModuleInternal {}

export class NgxParentInjectorChildModule {
  /**
   *
   * @param options.testMode default: false. Set to true when running tests.
   */
  public static forRoot(options?: NgxParentInjectorChildModuleOptions): ModuleWithProviders<NgxParentInjectorChildModuleInternal> {
    return {
      ngModule: NgxParentInjectorChildModuleInternal,
      providers: options?.testMode ? [] : getParentProviders()
    }
  }
}
