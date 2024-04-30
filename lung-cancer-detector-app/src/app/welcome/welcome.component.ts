import { Component } from '@angular/core';
import { NgxTranslateModule } from "../translate/translate.module";
import { TranslateService } from "@ngx-translate/core";

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

  constructor(private translate: TranslateService) {
    const currentLanguage = sessionStorage.getItem('currentLanguage') || this.translate.getDefaultLang();
    this.translate.use(currentLanguage);
  }
}
