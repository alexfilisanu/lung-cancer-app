import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public slides: Array<string> = ['Slide 1', 'Slide 2', 'Slide 3'];
  public currentSlideIndex: number = 0;
  private slideInterval: number | undefined;

  constructor() {}

  changeSlide(index: number) : void {
    this.currentSlideIndex = index;
    clearInterval(this.slideInterval);
    this.resetSlideInterval();
  }

  resetSlideInterval(): void {
    this.slideInterval = setInterval(() : void => {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }, 10000);
}

  ngOnInit() : void {
    this.resetSlideInterval();
  }
}
