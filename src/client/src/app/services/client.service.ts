import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable()
export class ClientService {

  constructor(private httpService:HttpService) { }

  list() {
    return this.httpService.get("client/").then((resp) => {
      let data = resp.json() as any[];
      return data;
    });
  }

  get(clientId:number) {
    return this.httpService.get("client/" + clientId, {id: clientId}).then((resp) => {
      let data = resp.json() as any;
      return data;
    });
  }
  save(client:{id?:number, name:string}) {
    let url = "client/";
    if (client.id) {
      url = url + "id";
    }
    return this.httpService.post(url, {id: client.id, name: client.name})
    .then((resp) => {
      // return the most up to date client here.
      let data = resp.json() as any;
      return data;
    });
  }
  delete(clientId:number) {
    return this.httpService.delete('client/' + clientId)
    .then((resp) => {
      // return the most up to date client here.
      let data = resp.json() as any;
      return data;
    });
  }
}
