import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class AppointmentService {

  constructor(private httpService:HttpService) { }

  list() {
    return this.httpService.get("appointment/").then((resp) => {
      let data = resp.json() as any[];
      return data;
    });
  }

  get(appointmentId:number) {
    return this.httpService.get("appointment/" + appointmentId, {id: appointmentId}).then((resp) => {
      let data = resp.json() as any[];
      return data;
    });
  }

  save(appointment:any) {
    let url = "appointment/";
    if (appointment.id) {
      url += appointment.id;
    }
    return this.httpService.post(url, appointment).then((resp) => {
      let data = resp.json() as any[];
      return data;
    });
  }
  delete(appointmentId:number) {
    // we could use the delete verb... but we'll just use post with a delete action.
    return this.httpService.delete("appointment/" + appointmentId).then((resp) => {
      return {};
    });
  }

}
