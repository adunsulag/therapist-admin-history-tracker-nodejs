import { Component, OnInit } from '@angular/core';
import { ActivitylogService } from '../services/activitylog.service';

@Component({
  selector: 'dac-activitylog-list',
  templateUrl: './activitylog-list.component.html',
  styleUrls: ['./activitylog-list.component.css']
})
export class ActivitylogListComponent implements OnInit {
  public logs:any[];
  public entities:string[] = [
    ""
    ,"SystemUser"
    ,"Client"
    ,"Therapist"
    ,"Appointment"
  ];
  public actions:string[] = [
    ""
    ,"SELECT"
    ,"INSERT"
    ,"DELETE"
    ,"UPDATE"
  ];
  private _searchFilter:any;
  public hasLoaded:boolean;

  constructor(private activityLogService:ActivitylogService) { 
    this.logs = [];
    this._searchFilter = {
      entity: ""
      ,action: ""
      ,entityID: ""
    };
  }

  public get searchFilter() {
    return this._searchFilter;
  }

  public set searchFilter(v:any) {
    this._searchFilter = v;
  }

  public filter() {
    if (!this.searchFilter || this.searchFilter == "") {
      return this.reset();
    }
    
    this.hasLoaded = false;
    this.activityLogService.search(this.searchFilter).then(logs => {
      this.setLogs(logs);
      this.hasLoaded = true;
    })
    .catch((error) => {
      console.log(error);
      this.hasLoaded = true;
    })
  }
  public reset() {
    this.logs = [];
    this._searchFilter = {
      entity: ""
      ,action: ""
      ,entityID: ""
    };
    this.hasLoaded = false;
    this.activityLogService.list().then(logs => {
      this.setLogs(logs)
      this.hasLoaded = true;
    })
    .catch((error) => {
      console.log(error);
      this.hasLoaded = true;
    })
  }

  private setLogs(logs) {
    console.log("Logs are now: ", logs);
      this.logs = logs;
  }

  ngOnInit() {
    this.reset();
  }

}
