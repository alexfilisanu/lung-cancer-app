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
  public prediction: String = "";
  private caseLabels: string[] = ['benign', 'malignant', 'normal'];
  public imageUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  public filesDropped(files: FileHandle[]): void {
    this.file = files.length > 0 ? files[0] : null;
    if (this.file) {
      this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.file.file));
    }
  }

  public async upload(): Promise<void> {
    if (this.file) {
      const model = await tf.loadLayersModel('http://127.0.0.1:3000/model.json');
      console.log("Dropped image:", this.file.file);

      // Preprocess the image
      const preprocessedImage = await this.preprocessImage(this.file.file);
      console.log("Preprocessed image shape:", preprocessedImage.shape);

      // Make prediction
      const output = model.predict(preprocessedImage) as tf.Tensor;
      const predictions = Array.from(output.dataSync());
      console.log("Predictions:", predictions);

      // Get the predicted class
      const predictedClassIndex = predictions.indexOf(Math.max(...predictions));
      this.prediction = this.caseLabels[predictedClassIndex];

      console.log("Prediction:", this.prediction);
    } else {
      // Handle case when no file is selected
      console.log("No image dropped.");
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

  public removeFile(): void {
    this.file = null;
  }
}
