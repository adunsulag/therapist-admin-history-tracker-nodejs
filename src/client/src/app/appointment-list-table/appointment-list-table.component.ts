import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'dac-appointment-list-table',
  templateUrl: './appointment-list-table.component.html',
  styleUrls: ['./appointment-list-table.component.scss']
})
export class AppointmentListTableComponent implements OnInit {

  @Input() appointments:any[];
  @Output() deleteItem:EventEmitter<any> = new EventEmitter<any>();
  
  constructor(private appointmentService:AppointmentService, private alertService:AlertService) { 
    this.appointments = [];
  }

  ngOnInit() {
    console.log(this.deleteItem);
  }

  public get Appointments() {
    if (this.appointments && this.appointments.length > 0) {
      return this.appointments;
    }
    return [];
  }

  public delete(appointment:any) {
    if (!appointment || !appointment.id) {
      console.error("delete called with invalid appointment");
      return;
    }
    this.alertService.info("Deleting appointment..");
    this.appointmentService.delete(appointment.id).then((result) => {
      this.alertService.success("Appointment deleted");
      this.deleteItem.emit(appointment);
    })
    .catch((error) => {
      this.alertService.error("Appointment failed to delete");
      console.log(error);
    })
  }
}
