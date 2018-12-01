import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentListTableComponent } from './appointment-list-table.component';

describe('AppointmentListTableComponent', () => {
  let component: AppointmentListTableComponent;
  let fixture: ComponentFixture<AppointmentListTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentListTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
