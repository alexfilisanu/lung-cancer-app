import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgClass
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  public isVisiblePassword: Boolean = false;
  public isVisibleConfirmPassword: Boolean = false;

  constructor(private translate: TranslateService) {
    const currentLanguage = sessionStorage.getItem('currentLanguage') || this.translate.getDefaultLang();
    this.translate.use(currentLanguage);
  }

  public togglePassword(): void {
    this.isVisiblePassword = !this.isVisiblePassword;
  }

  public toggleConfirmPassword(): void {
    this.isVisibleConfirmPassword = !this.isVisibleConfirmPassword;
  }
}
