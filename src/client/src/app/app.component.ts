import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';

import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Therapist Admin History Tracker';
  private _user:any;

  constructor(private authService:AuthService, private router:Router) {
  }

  ngOnInit() {
    this.authService.authStateChange()
    .subscribe(authState => {
      this._user = null;
        if (authState.state == 'signedIn') {
          this._user = authState.user;
        }
        else if (authState.state == 'signedOut') {
          this.router.navigate(["/login"]);
        }
    });
    this.authService.currentAuthenticatedUser().then((user) =>{
      this._user = user;
    })
    .catch((error) => {
      // if we first load and we are not logged in we need to make sure we go to the login route if we are not there already.
      this.router.navigate(["/login"]);
    })
  }

  public goHome() {
    if (this._user) {
      this.router.navigate(['/home']);
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  public get Username() {
    return this._user ? this._user.username : '';
  }

  public get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  public logout() {
    this.authService.signOut()
    .then(data => {
      console.log(data)
      this.router.navigate(["/login"]);
    })
    .catch(err => {
      console.log(err);
      // we still want to send people to login if we fail to logout for some reason.
      this.router.navigate(["/login"]);
    });
  }
}
