import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class TherapistService {

  private PATH:string = "therapist/";

  constructor(private httpService:HttpService) { }

  list() {
    return this.httpService.get(this.PATH).then((resp) => {
      let data = resp.json() as any[];
      return data;
    });
  }

  get(therapistId:number) {
    return this.httpService.get(this.PATH + therapistId, {id: therapistId}).then((resp) => {
      let data = resp.json() as any;
      return data;
    });
  }

  save(therapist:{id?:number, name:string}) {
    let url = this.PATH;
    if (therapist.id) {
      url = url + therapist.id;
    }
    return this.httpService.post(url, {id: therapist.id, name: therapist.name})
    .then((resp) => {
      // return the most up to date client here.
      let data = resp.json() as any;
      return data;
    });
  }
}
