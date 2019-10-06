import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueHeaderComponent } from './queue-header.component';

describe('QueueHeaderComponent', () => {
  let component: QueueHeaderComponent;
  let fixture: ComponentFixture<QueueHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QueueHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
