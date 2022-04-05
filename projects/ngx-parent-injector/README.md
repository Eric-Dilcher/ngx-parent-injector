# ngx-parent-injector
Inject parent window services (and other injectables) into child window Angular apps, allowing parent and child window apps to share data and behave as if they were a single app.
## Usage

`ngx-parent-angular` is intended to be used in a multi-window Angular app, where the parent and child windows are running separate Angular apps. For an overview on how to set up this kind of app, please see the [Demo App](https://github.com/foiled-plan/ngx-parent-injector).

1. Add `NgxParentInjectorModule` to the `imports` of the root Angular module of the parent window.
2. Add `NgxParentInjectorChildModule.forRoot(...)` to the `imports` of the root Angular module of each child window.

To inject a parent window's service in a child window:
1. In the parent window, the service's injection token must be explicitly exposed to the child window by calling `exposeToken()`.
2. In the child window, we request the parent window's service by using Angular's builtin `@Inject` decorator together with the `getParentToken()` function.

## Sample

**parentWindow/parentWindow.module.ts**
```typescript
// Angular imports omitted
import { exposeToken, NgxParentInjectorModule } from 'ngx-parent-injector';
import { SomeParentService } from './someParentModule/someParent.service';
import { SOME_PARENT_TOKEN } from './someParentModule/someParent.token';

@NgModule({
  // other metadata
  imports: [
    // other imports
    NgxParentInjectorModule,
  ],
  providers: [{
    provide: SOME_PARENT_TOKEN,
    useValue: "I'm an injection token value"
  }]
})
export class ParentWindowModule {
  public constructor() {
    // 1. expose InjectionTokens in the parent window
    exposeToken(SomeParentService);
    exposeToken(SOME_PARENT_TOKEN);
  }
}
```

**childWindow/childWindow.module.ts**
```typescript
// Angular imports omitted
import { NgxParentInjectorChildModule } from 'ngx-parent-injector/child';
import { ChildWindowComponent } from './childWindow.component.ts';

@NgModule({
  // other metadata
  imports: [
    // other imports
    NgxParentInjectorChildModule.forRoot(),
  ],
  declarations: [ChildWindowComponent],
  bootstrap: [ChildWindowComponent]
})
export class ChildWindowModule {}
```

**childWindow/childWindow.component.ts**
```typescript
// Angular imports omitted
import { getParentToken } from 'ngx-parent-injector/child';
import { SomeParentService } from '../parentWindow/someParentModule/someParent.service';
import { SOME_PARENT_TOKEN } from '../parentWindow/someParentModule/someParent.token';

@Component({
  template: '<div ngxParentInjectorChild>Child Window</div>'
})
export class ChildWindowComponent {
  public constructor(
    // 2. request parent window services or injectable values.
    @Inject(getParentToken(SomeParentService)) public someParentService: SomeParentService,
    @Inject(getParentToken(SOME_PARENT_TOKEN)) public injectionTokenValue: string
  ) {
    // Injected dependencies from parent window are ready to use
  }
}
```

## Testing
Unit testing child window code which consumes any code from `ngx-parent-injector/child` requires some additional steps.

1. Set `testMode: true` in the options passed to `NgxParentInjectorChild.forRoot`. This can be achieved by adjusting `environment.ts` to include a flag indicating test mode, and setting that flag to `true` during test builds by using `fileReplacements` in `angular.json`'s test block.
2. Since `getParentToken(token)` will simply return `token` unchanged if it can't find the corresponding token on the parent app, you can provide mocks for `token` as you normally would in the testing module.
3. Call `suppressWarnings()` before runing tests to prevent warnings from polluting the test output.

See the [Demo App](https://github.com/foiled-plan/ngx-parent-injector) for an example of unit tests.

## Conceptual overview

ngx-parent-injector works based on two separate concepts.

### Enabling child windows to inject services from the parent window.

The parent window's Angular injector as well as chosen injection tokens are attached to the parent's global window object.
Child windows can then access the parent window's injector and injection tokens using `window.opener`, and use them to get the runtime instances of the services in the child windows. This process is made unobtrusive in child Angular apps by using Angular's built in provider system and `@Inject` decorator.

Injection tokens (like constructor functions for services) will have separate in-memory representations in parent and child window apps, even if they are imported from the same source file. This means that simply using an injection token from a child window's app with the parent window's injector instance will not yield the expected result. For this reason, `ngx-parent-injector` relies on associating strings to injection tokens so that for any given child-window injection token, the corresponding parent-window token can be retrieved. For services, the constructor function's `name` value is used, and for instances of `InjectionToken`, the result of calling `toString()` is used. Note that this means that name collisions are technically possible, although in practice it rarely occurs. It also means that class names should not be mangled/obfuscated, because in general the same class will be obfuscated to a different symbol in parent and child apps.

### Triggering change detection in both the parent and child windows at appropriate moments.

By injecting services from a parent Angular app into a child Angular app, the apps become logically entangled. As a consequence, any change in the parent app may require a child app to update its view, and vice versa. This is achieved by injecting the parent app's `NgZone` service into the child app using the process described above. Every time the parent window's `NgZone`'s microtask queue empties, we manually trigger a change detection in the child window in order to update the child app's view in response to an event in the parent app. Conversely, whenever the microtask queue of the child app's own `NgZone` empties, we push an item to the parent app `NgZone`'s microtask queue to propagate events which originated in the child app to the parent app (as well as to trigger change detection in other child apps).


## Build

Run `ng build ngx-parent-injector` to build the project. The build artifacts will be stored in the `dist/ngx-parent-injector` directory.

## Publishing

After building your library with `ng build ngx-parent-injector`, go to the dist folder `cd dist/ngx-parent-injector` and run `npm publish`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
