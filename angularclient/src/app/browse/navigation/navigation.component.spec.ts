import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BrowseNavigationComponent} from './navigation.component';

describe('BrowseNavigationComponent', () => {
  let component: BrowseNavigationComponent;
  let fixture: ComponentFixture<BrowseNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseNavigationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
