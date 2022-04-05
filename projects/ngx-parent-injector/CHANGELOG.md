# Changelog

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 3.0.0 - 2022-04-05

- Breaking change: Trigger change detection in the child app using `ApplicationRef.tick()` instead of `ChangeDetectorRef.detectChanges()`, meaning the usage of `[ngxParentInjectorChild]` directive is no longer needed, and as such has been removed.
- Fixed typo in README where `npx-parent-injector` appeared instead of `ngx-parent-injector`, as well as other small mistakes.

## 2.0.1 - 2022-03-24

- Improve README.

## 2.0.0 - 2022-03-24

- Breaking change: Include `NgxParentInjectorChildModule.forRoot(..)` in the child window root module instead of `NgxParentInjectorChildModule`.
- Add support for mocking parent injectables in a test environment.
- Update README to include information on testing.

## 1.0.2 - 2022-03-18

- Update README so that the the most important information is listed first and that the README preview is better when searching NPM.

## 1.0.1 - 2022-03-18

- Added CHANGELOG.
- Updated README with a more detailed example.

## 1.0.0 - 2022-03-17

- Initial version. Unpublished due to incorrect peer dep ranges.
