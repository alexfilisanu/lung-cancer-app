import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { DragDropDirective, FileHandle } from './drag-drop.directive';
import { NgxTranslateModule } from "../translate/translate.module";

@Component({
  selector: 'app-CT-prediction',
  standalone: true,
  imports: [
    CommonModule,
    DragDropDirective,
    HttpClientModule,
    NgxTranslateModule
  ],
  templateUrl: './CT-prediction.component.html',
  styleUrl: './CT-prediction.component.css'
})
export class CTPredictionComponent {
  public file: FileHandle | null = null;
  public imageUrl: SafeResourceUrl | null = null;
  public prediction: string = '';
  public errorMessage: string = '';
  public showUploadButton: boolean = true;
  private isAuthenticated: boolean = sessionStorage.getItem('isAuthenticated') === 'true';

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  public onFilesDropped(files: FileHandle[]): void {
    this.errorMessage = '';
    this.file = files.length > 0 ? files[0] : null;
    if (this.file) {
      this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.file.file));
    }
  }

  public onFileSelected(event: any): void {
    this.errorMessage = '';
    const file: File = event.target.files[0];
    this.file = { file: file, url: URL.createObjectURL(file) };
  }

  public removeFile(): void {
    this.file = null;
  }

  public async upload(): Promise<void> {
    if (this.file) {
      this.showUploadButton = false;
      this.errorMessage = '';

      const formData = new FormData();
      formData.append('image', this.file.file);

      this.http.post<any>('http://127.0.0.1:3000/CT-predict', formData).subscribe({
        next: (response) => {
          this.prediction = this.getTranslation(response.prediction);
          this.insertPrediction(response.prediction);
        },
        error: (error) => {
          console.error('Error occurred while predicting the response:', error);
        }
      });
    } else {
      this.errorMessage = 'error.no-image-selected';
    }
  }

  private getTranslation(key: string): string {
    if (key === 'normal') {
      return 'CT-prediction.normal';
    } else if (key === 'benign') {
      return 'CT-prediction.benign';
    } else if (key === 'malignant') {
      return 'CT-prediction.malignant';
    } else {
      return 'CT-prediction.unknown';
    }
  }

  private insertPrediction(prediction: string): void {
    if (this.isAuthenticated) {
      const userEmail = sessionStorage.getItem('user-email');
      if (userEmail !== null) {
        const insertData = new FormData();
        insertData.append('user-email', userEmail);
        insertData.append('image', this.file!.file);
        insertData.append('prediction', prediction);
        this.http.post<any>('http://127.0.0.1:3050/insert-ct-prediction', insertData).subscribe({
          next: () => {
          },
          error: (error) => {
            console.error('Error occurred while inserting prediction:', error);
          }
        });
      } else {
        console.error('User email not found in session storage.');
      }
    }
  }
}
