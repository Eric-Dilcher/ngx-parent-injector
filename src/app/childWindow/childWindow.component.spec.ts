import { FactoryProvider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Counter } from '../counter/counter.service';
import { SOME_TOKEN } from '../injectionToken/injectionToken';

import { ChildWindowComponent } from './childWindow.component';

describe('ChildWindowComponent', () => {
  const parentProvidersMock: FactoryProvider[] = [
    {
      provide: Counter,
      useFactory: () => new Counter(),
    },
    {
      provide: SOME_TOKEN,
      useFactory: () => "I'm an injection token value",
    },
  ];
  let component: ChildWindowComponent;
  let fixture: ComponentFixture<ChildWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildWindowComponent],
      providers: parentProvidersMock,
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('SOME_TOKEN should be properly mocked', () => {
    expect(component.someTokenValue).toEqual("I'm an injection token value");
  });

  it('Counter should be properly mocked', () => {
    const counterSpy = jasmine.createSpy<(num: number) => void>();
    component.counter.counter$.subscribe(counterSpy);
    expect(counterSpy.calls.mostRecent().args[0]).toEqual(0);
    component.counter.increment();
    expect(counterSpy.calls.mostRecent().args[0]).toEqual(1);
    component.counter.add(3);
    expect(counterSpy.calls.mostRecent().args[0]).toEqual(4);
    component.counter.reset();
    expect(counterSpy.calls.mostRecent().args[0]).toEqual(0);
  });
});
