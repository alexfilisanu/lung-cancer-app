import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgxTranslateModule } from "../translate/translate.module";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxTranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  public contactUsForm: any;
  public errorMessage: string = '';
  public isFormSubmitted: boolean = false;
  public isFormRegistered: boolean = false;
  private isAuthenticated: boolean = sessionStorage.getItem('isAuthenticated') === 'true';
  private userName: string | null = sessionStorage.getItem('user-name');
  private userEmail: string | null = sessionStorage.getItem('user-email');

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.contactUsForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });

    if (this.isAuthenticated) {
      this.contactUsForm.patchValue({
        name: this.userName,
        email: this.userEmail
      });
    }
  }

  onSubmit(): void {
    this.isFormSubmitted = true;

    if (this.contactUsForm?.valid) {
      const formData = this.contactUsForm.value;
      console.log('Contact form data:', formData);
      this.errorMessage = '';

      this.http.post<any>('http://127.0.0.1:3050/add-contact-form', formData).subscribe({
        next: () => {
          this.isFormRegistered = true;
          this.sendEmail(formData.email, formData.name, formData.message);
        },
        error: (error) => {
          this.isFormRegistered = false;
          this.errorMessage = 'error.contact-form-submission-failed';
          console.error('Error occurred while submitting the contact form:', error);
        }
      });
    } else {
      this.isFormRegistered = false;
      this.errorMessage = 'error.all-fields-required';
    }
  }

  private sendEmail(email: string, name: string, message: string): void {
    this.http.post<any>('http://127.0.0.1:3200/send-contact-mail', { email, name, message }).subscribe({
      next: () => {
      },
      error: (error) => {
       console.error('Error sending email:', error);
      }
    });
  }
}
