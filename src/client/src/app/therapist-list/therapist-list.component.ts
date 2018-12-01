import { Component, OnInit } from '@angular/core';
import { TherapistService } from '../services/therapist.service';

@Component({
  selector: 'dac-therapist-list',
  templateUrl: './therapist-list.component.html',
  styleUrls: ['./therapist-list.component.css']
})
export class TherapistListComponent implements OnInit {
  public therapists:any;
  private hasLoaded:boolean;

  constructor(private therapistService:TherapistService) { 
    this.therapists = [];
  }

  ngOnInit() {
    this.hasLoaded = false;
    this.therapistService.list().then((therapists) => {
      console.log(therapists);
      this.therapists = therapists;
      this.hasLoaded = true;
    })
    .catch((error) => {
      console.log(error);
      this.hasLoaded = true;
    });
  }
}
