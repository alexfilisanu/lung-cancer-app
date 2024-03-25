import { Component } from '@angular/core';
import { NgxTranslateModule } from "../translate/translate.module";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    NgxTranslateModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
