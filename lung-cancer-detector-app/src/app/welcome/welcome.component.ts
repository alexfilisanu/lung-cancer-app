import { Component } from '@angular/core';
import { NgxTranslateModule } from "../translate/translate.module";

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    NgxTranslateModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

}
