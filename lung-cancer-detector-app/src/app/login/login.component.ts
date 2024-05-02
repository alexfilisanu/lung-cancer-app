import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NgClass } from "@angular/common";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

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

  public isVisible: boolean = false;
  public loginForm: any;
  public errorMessage: string = '';
  public isFormSubmitted: boolean = false;

  constructor(private translate: TranslateService, private formBuilder: FormBuilder, private http: HttpClient,
              private router: Router) {
    const currentLanguage = sessionStorage.getItem('currentLanguage') || this.translate.getDefaultLang();
    this.translate.use(currentLanguage);
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public togglePassword(): void {
    this.isVisible = !this.isVisible;
  }

  onSubmit(): void {
    this.isFormSubmitted = true;

    if (this.loginForm?.valid) {
      const formData = this.loginForm.value;
      this.errorMessage = '';

      this.http.post<any>('http://127.0.0.1:3100/auth/login', formData).subscribe({
        next: (response) => {
          sessionStorage.setItem('user-name', response.user.name);
          sessionStorage.setItem('user-email', response.user.email);
          this.router.navigate(['/dashboard']).catch(error => {
            console.error('Navigation error:', error);
          });
        },
        error: (error) => {
          const errorKey = error.error.message;
          this.translate.get(errorKey).subscribe((message: string) => {
            this.errorMessage = message;
            console.error('Error occurred while logging in the user:', message);
          });
        }
      });
    } else {
      this.errorMessage = 'error.all-fields-required';
    }
  }
}
