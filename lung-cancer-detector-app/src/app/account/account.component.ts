import { Component } from '@angular/core';
import { NgxTranslateModule } from "../translate/translate.module";
import { HttpClient } from "@angular/common/http";
import { NgForOf, NgIf, NgStyle } from "@angular/common";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    NgxTranslateModule,
    NgForOf,
    NgIf,
    NgStyle
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

      this.http.post<any>('http://127.0.0.1:3050/get-registrations', formData).subscribe({
        next: (response) => {
          this.registrations = response.registrations;
          this.registrations.map(registration => {
            if (registration.type === 'ct') {
              registration.image = 'data:image/png;base64,' + registration.image;
            } else if (registration.type === 'survey') {
              registration.image = '../../assets/images/survey-logo.png';
            }
          });
        },
        error: (error) => {
          console.error('Error fetching registration history:', error);
        }
      });
    }
  }

  public getColor(result: string): string {
    switch (result) {
      case 'normal':
        return 'rgba(147, 211, 251, 0.3)';
      case 'benign':
        return 'rgba(251, 249, 147, 0.3)';
      case 'malignant':
        return 'rgba(251, 178, 147, 0.3)';
      case 'cancer':
        return 'rgba(255, 71, 76, 0.3)';
      case 'no-cancer':
        return 'rgba(31, 214, 85, 0.3)';
      default:
        return '#ffffff';
    }
  }

  public getKey(result: string): string {
    if (result === 'normal') {
      return 'CT-prediction.normal';
    } else if (result === 'benign') {
      return 'CT-prediction.benign';
    } else if (result === 'malignant') {
      return 'CT-prediction.malignant';
    } else if (result === 'cancer') {
      return 'survey-prediction.cancer';
    } else if (result === 'no-cancer') {
      return 'survey-prediction.no-cancer';
    } else {
      return 'CT-prediction.unknown';
    }
  }
}
