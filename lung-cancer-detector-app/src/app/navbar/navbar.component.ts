import { Component } from '@angular/core';
import { NgxTranslateModule } from "../translate/translate.module";
import { TranslateService } from "@ngx-translate/core";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgxTranslateModule,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private currentLanguage: string = this.translate.defaultLang;

  constructor(private translate: TranslateService) {
    this.currentLanguage = sessionStorage.getItem('currentLanguage') || this.translate.getDefaultLang();
    this.translate.use(this.currentLanguage);
  }

  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  public changeLanguage(language: string): void {
      this.currentLanguage = language;
      sessionStorage.setItem('currentLanguage', this.currentLanguage);
      this.translate.use(language);
  }
}
