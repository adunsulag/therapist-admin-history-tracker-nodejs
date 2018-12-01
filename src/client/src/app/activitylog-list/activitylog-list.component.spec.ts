import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitylogListComponent } from './activitylog-list.component';

describe('ActivitylogListComponent', () => {
  let component: ActivitylogListComponent;
  let fixture: ComponentFixture<ActivitylogListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitylogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitylogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
