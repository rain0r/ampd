import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverModalComponent } from './cover-modal.component';

describe('CoverModalComponent', () => {
  let component: CoverModalComponent;
  let fixture: ComponentFixture<CoverModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CoverModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
