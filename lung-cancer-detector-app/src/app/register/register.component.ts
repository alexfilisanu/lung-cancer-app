import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { NgClass } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

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

  public isVisiblePassword: boolean = false;
  public isVisibleConfirmPassword: boolean = false;
  public registerForm: any;
  public errorMessage: string = '';
  public isFormSubmitted: boolean = false;

  constructor(private translate: TranslateService, private formBuilder: FormBuilder, private http: HttpClient,
              private router: Router) {
    const currentLanguage = sessionStorage.getItem('currentLanguage') || this.translate.getDefaultLang();
    this.translate.use(currentLanguage);
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), this.matchPassword.bind(this)]]
    });
  }

  private matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  public togglePassword(): void {
    this.isVisiblePassword = !this.isVisiblePassword;
  }

  public toggleConfirmPassword(): void {
    this.isVisibleConfirmPassword = !this.isVisibleConfirmPassword;
  }

  onSubmit(): void {
    this.isFormSubmitted = true;

    if (this.registerForm?.valid) {
      const formData = this.registerForm.value;
      this.errorMessage = '';

      this.http.post<any>('http://127.0.0.1:3100/auth/register', formData).subscribe({
        next: () => {
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('user-name', formData.name);
          sessionStorage.setItem('user-email', formData.email);
          this.sendEmail(formData.email, formData.name);
          this.router.navigate(['/dashboard']).catch(error => {
            console.error('Navigation error:', error);
          });
        },
        error: (error) => {
          const errorKey = error.error.message;
          this.translate.get(errorKey).subscribe((message: string) => {
            this.errorMessage = message;
            console.error('Error occurred while registering the user:', message);
          });
        }
      });
    } else if (this.areAllFieldsCompleted() && this.registerForm?.get("email").invalid) {
      this.errorMessage = 'error.invalid-email';
    } else if (this.areAllFieldsCompleted() && this.registerForm?.get("password").invalid) {
      this.errorMessage = 'error.invalid-password';
    } else if (this.areAllFieldsCompleted() && this.registerForm?.get("confirmPassword").invalid) {
      this.errorMessage = 'error.passwords-mismatch';
    } else {
      this.errorMessage = 'error.all-fields-required';
    }
  }

  private sendEmail(email: string, name: string): void {
    this.http.post<any>('http://127.0.0.1:3200/send-registration-email', { email, name }).subscribe({
        next: () => {
        },
        error: (error) => {
            console.error('Error sending email:', error);
        }
    });
  }

  private areAllFieldsCompleted(): boolean {
    return this.registerForm?.get("name").value
      && this.registerForm?.get("email").value
      && this.registerForm?.get("password").value
      && this.registerForm?.get("confirmPassword").value;
  }
}
