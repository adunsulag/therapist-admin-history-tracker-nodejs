import {IndividualConfig} from 'ng-mdb-pro/pro/alerts/toast/toast.config';
import {ToastService} from 'ng-mdb-pro/pro/alerts';
import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {

  constructor(private toastService:ToastService) { }

  public error(message:string, timeToDisplay?:number) : any {
    let options:IndividualConfig = {
      positionClass: 'toast-bottom-right'
    };
    if (timeToDisplay) {
      options.timeOut = timeToDisplay;
    }
    let title = '';
    let toast = this.toastService.error(message, title, options);
    return toast.toastId;
  }

  public info(message:string, timeToDisplay?:number) : any {
    let options:IndividualConfig = {
      positionClass: 'toast-bottom-right'
      // commenting these lines out for debugging purposes
      // ,extendedTimeOut: 60000
    };
    // timeToDisplay = 30000;
    if (timeToDisplay) {
      options.timeOut = timeToDisplay;
    }
    let title = '';

    let toast = this.toastService.info(message, title, options);
    return toast.toastId;
  }

  public clearAlert(alertId:any) {
    this.toastService.clear(alertId);
  }

  public success(message:string, timeToDisplay?:number) : any {
    let options:IndividualConfig = {
      positionClass: 'toast-bottom-right'
      // commenting these lines out for debugging purposes
      // ,extendedTimeOut: 60000
    };
    // timeToDisplay = 30000;
    if (timeToDisplay) {
      options.timeOut = timeToDisplay;
    }
    let title = '';
    let toast = this.toastService.success(message, title, options);
    return toast.toastId;
  }
}
