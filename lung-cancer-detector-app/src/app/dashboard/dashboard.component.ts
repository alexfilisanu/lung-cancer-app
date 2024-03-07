import { Component } from '@angular/core';
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BrowserModule} from "@angular/platform-browser";
// import {BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule

  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
