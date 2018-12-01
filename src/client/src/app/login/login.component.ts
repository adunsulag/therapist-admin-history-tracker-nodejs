import { Component, OnInit, OnDestroy } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dac-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private authSubscription: Subscription;

  constructor(private amplifyService: AmplifyService, private authService:AuthService, private router:Router) { 
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    // @see https://aws-amplify.github.io/docs/js/authentication
    let session = this.authService.currentAuthenticatedUser().then((user) =>{
      this.router.navigate(['home']);
    })
    .catch((error) =>{
      // for some reason if you have logged in, then logged out again, the authStateChange subscriptions still send an initial signedIn event
      // TODO: stephen see if there is a way to fix this logic, for now we will just check the authenticated user and subscription 
      // if we are not authenticated
      this.authSubscription = this.authService.authStateChange()
      .subscribe(authState => {
        if (authState.state == 'signedIn') {
          // TODO: stephen need to sync the state with the server here... creating the user or updating any information about them
          // that we have.
            this.router.navigate(['/home']);
        }
      });
    });
  }

}
