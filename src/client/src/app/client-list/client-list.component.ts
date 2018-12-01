import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'dac-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  public clients:any;
  public hasLoaded:boolean;

  constructor(private clientService:ClientService) { 
    this.clients = [];
  }

  ngOnInit() {
    this.hasLoaded = false;
    this.clientService.list().then((clients) => {
      console.log(clients);
      this.clients = clients;
      this.hasLoaded = true;
    })
    .catch((error) => {
      console.error(error);
      this.hasLoaded = true;
    });
  }

}
