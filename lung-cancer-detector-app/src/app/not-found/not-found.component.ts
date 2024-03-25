import { Component } from '@angular/core';
import {NgxTranslateModule} from "../translate/translate.module";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    NgxTranslateModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
