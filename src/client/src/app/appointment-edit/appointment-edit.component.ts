import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TherapistService } from '../services/therapist.service';
import { ClientService } from '../services/client.service';
import { AlertService } from '../services/alert.service';
import * as moment from 'moment';

@Component({
  selector: 'dac-appointment-edit',
  templateUrl: './appointment-edit.component.html',
  styleUrls: ['./appointment-edit.component.scss']
})
export class AppointmentEditComponent implements OnInit {

  public hasLoaded:boolean;
  private _appointment:any;
  private _therapists:any[];
  private _clients:any[];
  public startDateInvalid:boolean = false;
  public endDateInvalid:boolean = false;
  public statusInvalid:boolean = false;
  public therapistInvalid:boolean = false;
  public clientInvalid:boolean = false;

  constructor(private route:ActivatedRoute, private router:Router
    , private apptService:AppointmentService
    , private therapistService:TherapistService
    , private clientService:ClientService
    , private alertService:AlertService) { 
    this._appointment = {};
    this._therapists = [];
    this._clients = [];
  }

  ngOnInit() {
    this.hasLoaded = false;

    this.route.params.subscribe(params => {
      if (!params['id'] || isNaN(+params['id'])) {
        this.router.navigate(['/page-not-found']);
        return;
      }
      let therapistsPromise = this.therapistService.list().then((therapists) => {
        this._therapists = therapists;
      });

      let clientsPromise = this.clientService.list().then((clients) => {
        this._clients = clients;
      });

      let id = +params['id'];
      let apptProfilePromise = this.apptService.get(id).then((appointment) => {
        this._appointment = appointment;
      });

      Promise.all([therapistsPromise, clientsPromise, apptProfilePromise]).then((results) =>{
        this.hasLoaded = true;
      })
      .catch(error => {
        this.hasLoaded = true;
        console.error(error);
      });
    });

  }

  private validateItems() {
    this.endDateInvalid = this.startDateInvalid = this.clientInvalid = this.therapistInvalid = this.statusInvalid = false;
    let isValid = true;
    let intStart = moment(this.editItem.startDate).unix();
    let intEnd = moment(this.editItem.endDate).unix();
    if (isNaN(intStart) || intStart < 0) {
      this.startDateInvalid = true;
      isValid = false;
    }
    if (isNaN(intEnd) || intEnd < 0 || intEnd <= intStart) {
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
    this.apptService.save(this.editItem).then((result:any) => {
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

  public get editItem() {
    return this._appointment || {};
  }

}
