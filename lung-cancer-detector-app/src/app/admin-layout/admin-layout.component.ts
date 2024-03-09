import { Component } from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterOutlet
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
