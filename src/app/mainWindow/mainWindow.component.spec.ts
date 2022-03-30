import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SOME_TOKEN } from '../injectionToken/injectionToken';

import { MainWindowComponent } from './mainWindow.component';


describe('MainWindowComponent', () => {
  let component: MainWindowComponent;
  let fixture: ComponentFixture<MainWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainWindowComponent],
      providers: [
        {
          provide: SOME_TOKEN,
          useFactory: () => "I'm an injection token value",
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
