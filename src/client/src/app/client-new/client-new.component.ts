import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'dac-client-new',
  templateUrl: './client-new.component.html',
  styleUrls: ['./client-new.component.scss']
})
export class ClientNewComponent implements OnInit {
  public editItem:any;
  public nameInvalid:boolean = false;

  constructor(private clientService:ClientService
    , private alertService:AlertService
  , private router:Router
) { 
    this.editItem = {};
  }

  ngOnInit() {
  }

  save() {
    this.nameInvalid = false;
    if (!this.editItem.name || this.editItem.name.trim() == "") {
      this.nameInvalid = true;
      return;
    }
    let alert = this.alertService.info("Saving...");
    this.clientService.save(this.editItem).then((result:any) => {
      this.alertService.clearAlert(alert);
      this.alertService.success("Client saved");
      this.router.navigate(["/", "clients", "edit", result.id]);
    })
    .catch((error) => {
      console.log(error);
      this.alertService.clearAlert(alert);
      this.alertService.error("There was an error in saving the client");
    });
  }
}
