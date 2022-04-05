# ngx-parent-injector-demo

This is a demo app illustrating how to set up a multi-window Angular app using `ngx-parent-injector`, where each child window's Angular app can inject services (and other injectables) from the _parent_ window's Angular app. When building desktop apps using frontend technologies (for example with [Electron](https://www.electronjs.org/)), having multiple application windows can be desirable. Using `ngx-parent-injector` can simplify your development of multi-window Angular applications.

## Using ngx-parent-injector npm package
Usage of the package is described in the [dedicated README](https://github.com/foiled-plan/ngx-parent-injector/blob/main/projects/ngx-parent-injector/README.md) 

## Setup

This demo is set up to use the local version of `ngx-parent-injector` (located in `projects/ngx-parent-injector`). To use the published npm module (recommended), clean up all traces of the local version of `ngx-parent-injector` by performing the following steps:
1. Remove the `ngx-parent-injector` project from `angular.json`.
2. Delete the `build-lib` script from `package.json`.
2. Delete `projects/ngx-parent-angular`. 
3. Remove `paths` from `tsconfig.json`.
4. Run `npm i ngx-parent-angular`.

If, for any reason, you wish to continue with the local version of `ngx-parent-injector`:
1. run `npm i`.
2. run `npm run build-lib`.

## Setting up your own multi-page angular app.
Configuring your Angular build to generate multiple pages is not trivial. This demo app illustrates one way to achieve this. Below are the key components of the configuration:
1. Use `@angular-builders/custom-webpack` to augment the underlying webpack config with a custom webpack config.
2. In the custom webpack config (here called `extra-webpack-config.ts`):
    * define a `vendor` chunk and add it to`optimization.splitChunks.cacheGroups` in order to prevent npm dependencies (like Angular itself) from being duplicated in every window-specific chunk.
    * for each child window, add an item to `entry` in order to generate a separate JS file for the child window.
    * for each child window, add a new instace of `HtmlWebpackPlugin` to `plugins` in order to generate a separate HTML file for the child window. Be sure to add the previous JS file to the `chunks` array.
3. For each child window, add the path to the entry `ts` file to the `tsconfig.app.json`'s `"files"` array in order to include it in the TS compilation step.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the demo app. The build artifacts will be stored in the `dist/` directory.
