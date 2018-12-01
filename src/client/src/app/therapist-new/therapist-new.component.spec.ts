import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistNewComponent } from './therapist-new.component';

describe('TherapistNewComponent', () => {
  let component: TherapistNewComponent;
  let fixture: ComponentFixture<TherapistNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TherapistNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapistNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
