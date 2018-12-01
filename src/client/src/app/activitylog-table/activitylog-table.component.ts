import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dac-activitylog-table',
  templateUrl: './activitylog-table.component.html',
  styleUrls: ['./activitylog-table.component.scss']
})
export class ActivitylogTableComponent implements OnInit {

  @Input() logs:any[];
  
  constructor() { 
    this.logs = [];
  }

  ngOnInit() {
  }

  public get Logs() {
    if (this.logs && this.logs.length > 0) {
      return this.logs;
    }
    return [];
  }

}
