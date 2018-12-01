import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitylogTableComponent } from './activitylog-table.component';

describe('ActivitylogTableComponent', () => {
  let component: ActivitylogTableComponent;
  let fixture: ComponentFixture<ActivitylogTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitylogTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitylogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
