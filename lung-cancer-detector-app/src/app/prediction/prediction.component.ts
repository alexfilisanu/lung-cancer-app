import { Component } from '@angular/core';
import {DragDropDirective, FileHandle} from './drag-drop.directive';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-prediction',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    DragDropDirective
  ],
  templateUrl: './prediction.component.html',
  styleUrl: './prediction.component.css'
})
export class PredictionComponent {
  public files: FileHandle[] = [];

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }

  upload(): void {
    //get image upload file obj;
  }
}
