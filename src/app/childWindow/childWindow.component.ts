import { Component, Inject } from '@angular/core';
import { getParentToken } from "ngx-parent-injector/child";
import { Counter } from '../counter/counter.service';
import { SOME_TOKEN } from "../injectionToken/injectionToken";

@Component({
  selector: 'child-window-root',
  templateUrl: './childWindow.component.html',
  styleUrls: ['../mainWindow/mainWindow.component.scss'],
})
export class ChildWindowComponent {
  public constructor(
    @Inject(getParentToken(Counter)) public counter: Counter,
    @Inject(getParentToken(SOME_TOKEN)) public someTokenValue: string
  ) {}

  public close(): void {
    window.close();
  }
}
