import { Component, OnInit } from '@angular/core';
import { TherapistService } from '../services/therapist.service';
import { ClientService } from '../services/client.service';
import { AlertService } from '../services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../services/appointment.service';
import * as moment from 'moment';
@Component({
  selector: 'dac-appointment-new',
  templateUrl: './appointment-new.component.html',
  styleUrls: ['./appointment-new.component.scss']
})
export class AppointmentNewComponent implements OnInit {

  public hasLoaded:boolean;
  public editItem:any;
  private _appointment:any;
  private _therapists:any[];
  private _clients:any[];

  public startDateInvalid:boolean = false;
  public endDateInvalid:boolean = false;
  public statusInvalid:boolean = false;
  public therapistInvalid:boolean = false;
  public clientInvalid:boolean = false;

  constructor(private therapistService:TherapistService
    , private clientService:ClientService
    , private alertService:AlertService
    , private appointmentService:AppointmentService
    , private router:Router
    , private route:ActivatedRoute) { 
    this._appointment = {};
    this._therapists = [];
    this._clients = [];
    this.editItem = {};
  }

  ngOnInit() {
    this.hasLoaded = false;
    let therapistsPromise = this.therapistService.list().then((therapists) => {
      this._therapists = therapists;
      let therapistID = this.route.snapshot.queryParams['therapist'];
      let therapist = therapists.find(t => t.id == therapistID);
      if (therapist) {
        this.editItem.therapistID = therapistID;
      }
    });

    let clientsPromise = this.clientService.list().then((clients) => {
      this._clients = clients;
      let clientID = this.route.snapshot.queryParams['client'];
      let client = clients.find(t => t.id == clientID);
      if (client) {
        this.editItem.clientID = clientID;
      }
    });
    Promise.all([therapistsPromise, clientsPromise]).then((results) =>{
      this.hasLoaded = true;
    })
    .catch(error => {
      this.hasLoaded = true;
      console.error(error);
    });

  }
  private validateItems() {
    this.endDateInvalid = this.startDateInvalid = this.clientInvalid = this.therapistInvalid = this.statusInvalid = false;
    let isValid = true;
    let intStart = moment(this.editItem.startDate).unix();
    let intEnd = moment(this.editItem.endDate).unix();
    if (!this.editItem.startDate || isNaN(intStart) || intStart < 0) {
      this.startDateInvalid = true;
      isValid = false;
    }
    if (!this.editItem.endDate || isNaN(intEnd) || intEnd < 0 || intEnd <= intStart) {
      this.endDateInvalid = true;
      isValid = false;
    }
    if (!this.editItem.clientID || isNaN(this.editItem.clientID)) {
      isValid = false;
      this.clientInvalid = true;
    }
    if (!this.editItem.therapistID || isNaN(this.editItem.clientID)) {
      isValid = false;
      this.therapistInvalid = true;
    }
    if (!this.editItem.status) {
      isValid = false;
      this.statusInvalid = true;
    }
    return isValid;
  }

  public save() {
    if (!this.validateItems()) {
      return;
    }

    let alert = this.alertService.info("Saving...");
    this.appointmentService.save(this.editItem).then((result:any) => {
      this.alertService.clearAlert(alert);
      this.alertService.success("Appointment saved");
      this.router.navigate(["/", "appointments", "edit", result.id]);
    })
    .catch((error) => {
      console.log(error);
      this.alertService.clearAlert(alert);
      this.alertService.error("There was an error in saving the appointment");
    });
  }

  public get statii() {
    return ['pending', 'canceled', 'noshow', 'completed'];
  }

  public get therapists() {
    return this._therapists;
  }

  public get clients() {
    return this._clients;
  }

}
