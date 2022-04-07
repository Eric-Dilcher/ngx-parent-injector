import {
  FactoryProvider,
  InjectionToken,
  Injector,
  ProviderToken,
} from '@angular/core';

type ConstructorFunction = new (...args: any[]) => any;

let WARNINGS_ENABLED = true;

/**
 * Disable warning logs. Useful when running code in test environments, as this environment will usually trigger warnings.
 */
export function disableWarnings(): void {
  WARNINGS_ENABLED = false;
}

export function getParentToken<T extends ConstructorFunction>(
  token: T | InjectionToken<any>
): any {
  if (WARNINGS_ENABLED && window.opener === null) {
    console.warn(
      '`getParentToken` needs access to `window.opener` to work in production. To suppress this message (e.g. during tests), call `disableWarnings()`.'
    );
  }
  const tokenName =
    token instanceof InjectionToken ? token.toString() : token.name;
  const parentTokenInstance =
    window.opener?.ngxParentInjector?.injectionTokens?.[tokenName];

  if (parentTokenInstance === undefined) {
    WARNINGS_ENABLED &&
      console.warn(
        "Couldn't find parent angular injection token for ${tokenName}. Falling back to original token. Did you forget to call `exposeToken(...)` in the parent app?"
      );
    return token;
  } else {
    return parentTokenInstance;
  }
}

export function getParentProviders(): FactoryProvider[] {
  if (!window.opener) {
    throw new Error(
      'Cannot access parent window via `window.opener`. If you are running tests, did you set `testMode: true` in `NgxParentInjectorChildModule.forRoot(...)`?'
    );
  }
  if (!window.opener?.ngxParentInjector?.injectionTokens) {
    throw new Error(
      "Couldn't find parent angular injection tokens. Were any exposed in the parent app using `exposeToken()`?"
    );
  }
  const parentTokens = Object.values(
    window.opener.ngxParentInjector.injectionTokens
  );
  const parentInjector = window.opener?.ngxParentInjector?.parentInjector as
    | Injector
    | undefined;
  if (parentInjector === undefined) {
    throw new Error(
      "Cannot find parent angular injector! Was `NgxParentInjectorModule` added to the parent app's `imports`?"
    );
  }
  return parentTokens.map((token) =>
    factoryProviderFactory(parentInjector, token)
  );
}

function factoryProviderFactory(
  parentInjector: Injector,
  token: unknown
): FactoryProvider {
  return {
    provide: token,
    useFactory: () => parentInjector.get(token as ProviderToken<unknown>),
  };
}
