/* eslint-disable */
import { Injector, InjectionToken } from '@angular/core';

interface NgxParentInjectorData {
  injectionTokens?: Record<string, any>;
  parentInjector?: Injector;
}

declare global {
  interface Window {
    ngxParentInjector: NgxParentInjectorData
  }
}

type ConstructorFunction = new (...args: any[]) => any;

export function exposeToken<T extends ConstructorFunction>(
  token: T | InjectionToken<any>
): void {
  if (window.opener) {
    throw new Error('Cannot expose tokens in a child window');
  }
  if (!window.ngxParentInjector?.injectionTokens) {
    window.ngxParentInjector = {
      ...(window.ngxParentInjector || {}),
      injectionTokens: {},
    };
  }
  window.ngxParentInjector!.injectionTokens![
    token instanceof InjectionToken ? token.toString() : token.name
  ] = token;
}
