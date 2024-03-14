import { Routes } from '@angular/router';
import {AboutComponent} from "./about/about.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AdminLayoutComponent} from "./admin-layout/admin-layout.component";
import {ContactUsComponent} from "./contact-us/contact-us.component";
import {PredictionComponent} from "./prediction/prediction.component";
import {WelcomeComponent} from "./welcome/welcome.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {AdvicesComponent} from "./advices/advices.component";

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
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
        path: 'advices',
        component: AdvicesComponent
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
