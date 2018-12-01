import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistEditComponent } from './therapist-edit.component';

describe('TherapistEditComponent', () => {
  let component: TherapistEditComponent;
  let fixture: ComponentFixture<TherapistEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TherapistEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapistEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
