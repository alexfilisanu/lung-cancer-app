import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import * as tf from '@tensorflow/tfjs';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {DragDropDirective, FileHandle} from './drag-drop.directive';

@Component({
  selector: 'app-prediction',
  standalone: true,
  imports: [
    NgIf,
    DragDropDirective
  ],
  templateUrl: './prediction.component.html',
  styleUrl: './prediction.component.css'
})
export class PredictionComponent {
  public file: FileHandle | null = null;
  public imageUrl: SafeResourceUrl | null = null;
  public prediction: String = '';
  public showUploadButton: boolean = true;

  private model: tf.LayersModel | null = null;
  private caseLabels: string[] = ['benign', 'malignant', 'normal'];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadModel()
      .then(() => console.log('Model loaded successfully'))
      .catch(error => console.error('Failed to load model:', error));
  }

  private async loadModel(): Promise<void> {
    this.model = await tf.loadLayersModel('http://127.0.0.1:3000/model.json');
  }

  public onFilesDropped(files: FileHandle[]): void {
    this.file = files.length > 0 ? files[0] : null;
    if (this.file) {
      this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.file.file));
    }
  }

  public onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.file = { file: file, url: URL.createObjectURL(file) };
  }

  public removeFile(): void {
    this.file = null;
  }

  public async upload(): Promise<void> {
    if (this.file && this.model) {
      this.showUploadButton = false;

      const preprocessedImage = await this.preprocessImage(this.file.file);
      const output = this.model.predict(preprocessedImage) as tf.Tensor;
      const predictions = Array.from(output.dataSync());
      const predictedClassIndex = predictions.indexOf(Math.max(...predictions));

      this.prediction = this.caseLabels[predictedClassIndex];
    } else {
      console.log("Either model is not loaded or no image dropped.");
    }
  }

  private async preprocessImage(file: File): Promise<tf.Tensor> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          const tensor = tf.browser.fromPixels(image)
            .toFloat()
            .sub(127.5)  // Subtract the mean value for normalization
            .div(127.5)   // Divide by the standard deviation for normalization
            .resizeNearestNeighbor([224, 224])
            .expandDims();
          resolve(tensor);
        };
        image.onerror = (error) => {
          reject(error);
        };
      };
      reader.readAsDataURL(file);
    });
  }
}
