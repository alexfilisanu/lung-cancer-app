import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterOutlet
  ],
  providers: [
    TranslateService
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
