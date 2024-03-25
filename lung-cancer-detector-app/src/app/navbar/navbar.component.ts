import { Component } from '@angular/core';
import { NgxTranslateModule } from "../translate/translate.module";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgxTranslateModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
