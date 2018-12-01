import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TherapistService } from '../services/therapist.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'dac-therapist-edit',
  templateUrl: './therapist-edit.component.html',
  styleUrls: ['./therapist-edit.component.scss']
})
export class TherapistEditComponent implements OnInit {

  public hasLoaded:boolean;
  public _therapist:any;
  public nameInvalid:boolean = false;
  constructor(private route:ActivatedRoute, private router:Router, private therapistService:TherapistService
  , private alertService:AlertService) { 
    this._therapist = {
      logs: [],
      appointments: []
    };
  }

  ngOnInit() {
    this.hasLoaded = false;
    this.route.params.subscribe(params => {
      if (!params['id'] || isNaN(+params['id'])) {
        this.router.navigate(['/page-not-found']);
        return;
      }
      let id = +params['id'];
      this.therapistService.get(id).then((therapist) => {
        this._therapist = therapist;
        this.hasLoaded = true;
      })
      .catch((error) => {
        console.error(error);
        this.hasLoaded = true;
      })
    });
  }

  public get editItem() {
    return this._therapist || { logs: [], appointments: []};
  }


  public save() {
    this.nameInvalid = false;
    if (!this.editItem.name || this.editItem.name.trim() == "") {
      this.nameInvalid = true;
      return;
    }

    let alert = this.alertService.info("Saving...");
    this.therapistService.save(this.editItem).then((result:any) => {
      this.alertService.clearAlert(alert);
      this.alertService.success("Therapist saved");
      this._therapist = result;
    })
    .catch((error) => {
      console.log(error);
      this.alertService.clearAlert(alert);
      this.alertService.error("There was an error in saving the therapist");
    });
  }

  public removeAppointment(appt:any) {
    if (!appt) {
      console.error("removeAppointment called without an appointment");
      return;
    }
    this._therapist.appointments = this._therapist.appointments.filter(apt => apt.id != appt.id);
  }

}
