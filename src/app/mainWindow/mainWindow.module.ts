import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { exposeToken, NgxParentInjectorModule } from 'ngx-parent-injector';

import { MainWindowComponent } from './mainWindow.component';
import { Counter } from '../counter/counter.service';
import { SOME_TOKEN } from '../injectionToken/injectionToken';

@NgModule({
  declarations: [MainWindowComponent],
  imports: [BrowserModule, NgxParentInjectorModule],
  providers: [
    {
      provide: SOME_TOKEN,
      useValue: "I'm an injection token value",
    },
  ],
  bootstrap: [MainWindowComponent],
})
export class MainWindowModule {
  public constructor() {
    exposeToken(Counter);
    exposeToken(SOME_TOKEN);
  }
}
