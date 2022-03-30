import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxParentInjectorChildModule } from 'ngx-parent-injector/child';
import { environment } from 'src/environments/environment';

import { ChildWindowComponent } from './childWindow.component';

@NgModule({
  declarations: [ChildWindowComponent],
  imports: [
    BrowserModule,
    NgxParentInjectorChildModule.forRoot({ testMode: environment.test }),
  ],
  bootstrap: [ChildWindowComponent],
})
export class ChildWindowModule {}
