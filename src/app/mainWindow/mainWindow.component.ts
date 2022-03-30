import { Component, Inject } from '@angular/core';
import { Counter } from '../counter/counter.service';
import { SOME_TOKEN } from '../injectionToken/injectionToken';

@Component({
  selector: 'main-window-root',
  templateUrl: './mainWindow.component.html',
  styleUrls: ['./mainWindow.component.scss'],
})
export class MainWindowComponent {
  public constructor(
    public counter: Counter,
    @Inject(SOME_TOKEN) public someTokenValue: string
  ) {}

  public openWindow(): void {
    window.open('./childWindow.html');
  }
}
