import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgClass
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public isVisible: Boolean = false;

  constructor(private translate: TranslateService) {
    const currentLanguage = sessionStorage.getItem('currentLanguage') || this.translate.getDefaultLang();
    this.translate.use(currentLanguage);
  }

  public togglePassword(): void {
    this.isVisible = !this.isVisible;
  }
}
