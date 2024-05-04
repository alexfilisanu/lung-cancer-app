import { Component } from '@angular/core';
import { NgxTranslateModule } from "../translate/translate.module";
import { HttpClient } from "@angular/common/http";
import {any} from "@tensorflow/tfjs";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    NgxTranslateModule,
    NgForOf
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  public userName: string | null = sessionStorage.getItem('user-name');
  public userEmail: string | null = sessionStorage.getItem('user-email');
  public registrations: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRegistrationHistory();
  }

  private fetchRegistrationHistory(): void {
    if (this.userEmail) {
      const formData = new FormData();
      formData.append('user-email', this.userEmail);

      this.http.post<any>('http://127.0.0.1:3050/get-registration', formData).subscribe({
        next: (response) => {
          this.registrations = response.registrations;
          this.registrations.forEach(registration => {
            registration.image = 'data:image/png;base64,' + registration.image;
          });
        },
        error: (error) => {
          console.error('Error fetching registration history:', error);
        }
      });
    }
  }
}
