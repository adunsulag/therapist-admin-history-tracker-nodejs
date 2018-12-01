import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../services/client.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'dac-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent implements OnInit {
  public hasLoaded:boolean;
  public nameInvalid:boolean = false;
  public _client:any;
  constructor(private route:ActivatedRoute, private router:Router, private clientService:ClientService
  ,private alertService:AlertService) { 
    this._client = {
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
      let clientId = +params['id'];
      this.clientService.get(clientId).then((client) => {
        this._client = client;
        this.hasLoaded = true;
      })
      .catch((error) => {
        console.error(error);
        this.hasLoaded = true;
      })
    });
  }

  public save() {
    this.nameInvalid = false;
    if (!this.editItem.name || this.editItem.name.trim() == "") {
      this.nameInvalid = true;
      return;
    }
    let alert = this.alertService.info("Saving...");
    this.clientService.save(this.editItem).then((result:any) => {
      this.alertService.clearAlert(alert);
      this.alertService.success("Client saved");
      this._client = result;
    })
    .catch((error) => {
      console.log(error);
      this.alertService.clearAlert(alert);
      this.alertService.error("There was an error in saving the client");
    });
  }

  public get editItem() {
    return this._client || { logs: [], appointments: []};
  }

  public removeAppointment(appt:any) {
    if (!appt) {
      console.error("removeAppointment called without an appointment");
      return;
    }
    console.log("got here");
    this._client.appointments = this._client.appointments.filter(apt => apt.id != appt.id);
  }

}
