import { Component } from '@angular/core';
import { NgxTranslateModule } from "../translate/translate.module";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgxTranslateModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  public currentYear: number = new Date().getFullYear();
}
