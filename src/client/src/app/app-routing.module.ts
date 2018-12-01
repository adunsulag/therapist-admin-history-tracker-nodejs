import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { TherapistListComponent } from './therapist-list/therapist-list.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ActivitylogListComponent } from './activitylog-list/activitylog-list.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { ClientNewComponent } from './client-new/client-new.component';
import { TherapistEditComponent } from './therapist-edit/therapist-edit.component';
import { TherapistNewComponent } from './therapist-new/therapist-new.component';
import { AppointmentEditComponent } from './appointment-edit/appointment-edit.component';
import { AppointmentNewComponent } from './appointment-new/appointment-new.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [ 
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'home', component: HomeComponent },
  { path: 'therapists', component: TherapistListComponent},
  { path: 'therapists/edit/:id', component: TherapistEditComponent},
  { path: 'therapists/new', component: TherapistNewComponent},
  { path: 'clients', component: ClientListComponent},
  { path: 'clients/edit/:id', component: ClientEditComponent},
  { path: 'clients/new', component: ClientNewComponent},
  { path: 'activitylog', component: ActivitylogListComponent},
  { path: 'appointments', component: AppointmentListComponent},
  { path: 'appointments/edit/:id', component: AppointmentEditComponent},
  { path: 'appointments/new', component: AppointmentNewComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule
    ,RouterModule.forRoot(routes, {enableTracing: false})
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }