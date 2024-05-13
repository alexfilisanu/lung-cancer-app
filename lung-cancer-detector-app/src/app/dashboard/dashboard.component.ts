import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgxTranslateModule } from "../translate/translate.module";

export const Slides = [
  {
    text: 'dashboard.slide-1.text',
    link: 'dashboard.slide-1.link'
  },
  {
    text: 'dashboard.slide-2.text',
    link: 'dashboard.slide-2.link'
  },
  {
    text: 'dashboard.slide-3.text',
    link: 'dashboard.slide-3.link'
  }
]

export const Reviews = [
  {
    image: 'dashboard.review-1.image',
    name: 'dashboard.review-1.name',
    comment: 'dashboard.review-1.comment'
  },
  {
    image: 'dashboard.review-2.image',
    name: 'dashboard.review-2.name',
    comment: 'dashboard.review-2.comment'
  },
  {
    image: 'dashboard.review-3.image',
    name: 'dashboard.review-3.name',
    comment: 'dashboard.review-3.comment'
  }
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgxTranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public slides = Slides;
  public currentSlideIndex: number = 0;
  public reviews = Reviews;
  public currentReviewIndex: number = 0;

  private slideInterval: number | undefined;

  constructor() {}

  ngOnInit(): void {
    this.resetSlideInterval();
  }

  ngOnDestroy(): void {
    this.clearSlideInterval();
  }

  public changeSlide(index: number): void {
    this.currentSlideIndex = index;
    this.resetSlideInterval();
  }

  private resetSlideInterval(): void {
    this.clearSlideInterval();
    this.slideInterval = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    }, 10000);
  }

  private clearSlideInterval(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = undefined;
    }
  }

  public prev(): void {
    if (this.currentReviewIndex > 0) {
      this.currentReviewIndex--;
    } else {
      this.currentReviewIndex = this.reviews.length - 1;
    }
  }

  public next(): void {
    if (this.currentReviewIndex < this.reviews.length - 1) {
      this.currentReviewIndex++;
    } else {
      this.currentReviewIndex = 0;
    }
  }
}
