import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {DragDropDirective, FileHandle} from './drag-drop.directive';
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-CT-prediction',
  standalone: true,
  imports: [
    NgIf,
    DragDropDirective,
    HttpClientModule
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
        next: (response) => { this.prediction = response.prediction; },
        error: (error) => { console.error('Error occurred while predicting the response:', error); }
      });
    } else {
      this.errorMessage = 'No image selected. Please select an image to upload.';
    }
  }
}
