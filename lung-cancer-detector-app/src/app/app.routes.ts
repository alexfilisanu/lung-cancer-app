import { Routes } from '@angular/router';
import {AboutComponent} from "./about/about.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AdminLayoutComponent} from "./admin-layout/admin-layout.component";
import {ContactUsComponent} from "./contact-us/contact-us.component";
import {PredictionComponent} from "./prediction/prediction.component";

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'prediction',
        component: PredictionComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      }
    ]
  }
];
