import { Component } from '@angular/core';
import { NgxTranslateModule } from "../translate/translate.module";
import { TranslateService } from "@ngx-translate/core";

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

  constructor(private translate: TranslateService) {
    const currentLanguage = sessionStorage.getItem('currentLanguage') || this.translate.getDefaultLang();
    this.translate.use(currentLanguage);
  }
}
