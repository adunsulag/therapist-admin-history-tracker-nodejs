import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { TherapistService } from '../services/therapist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'dac-therapist-new',
  templateUrl: './therapist-new.component.html',
  styleUrls: ['./therapist-new.component.scss']
})
export class TherapistNewComponent implements OnInit {

  public editItem:any;
  public nameInvalid:boolean = false;
  constructor(private alertService:AlertService, private therapistService:TherapistService
  ,private router:Router) { 
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
    this.therapistService.save(this.editItem).then((result:any) => {
      this.alertService.clearAlert(alert);
      this.alertService.success("Therapist saved");
      this.router.navigate(["/", "therapists", "edit", result.id]);
    })
    .catch((error) => {
      console.log(error);
      this.alertService.clearAlert(alert);
      this.alertService.error("There was an error in saving the therapist");
    });
  }

}
