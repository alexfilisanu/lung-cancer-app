import { Component } from '@angular/core';
import { NgxTranslateModule } from "../translate/translate.module";

@Component({
  selector: 'app-advices',
  standalone: true,
  imports: [
    NgxTranslateModule
  ],
  templateUrl: './advices.component.html',
  styleUrl: './advices.component.css'
})
export class AdvicesComponent {

}
