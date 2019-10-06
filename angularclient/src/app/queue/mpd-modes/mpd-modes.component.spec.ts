import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpdModesComponent } from './mpd-modes.component';

describe('MpdModesComponent', () => {
  let component: MpdModesComponent;
  let fixture: ComponentFixture<MpdModesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MpdModesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpdModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
