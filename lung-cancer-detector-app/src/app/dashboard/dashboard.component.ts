import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

export const Slides = [
    'Scoala1 Scoala1 Scoala1 Scoala1 Scoala1 Scoala1',
    'Scoala2 Scoala2 Scoala2 Scoala2 Scoala2 Scoala2',
    'Scoala3 Scoala3 Scoala3 Scoala3 Scoala3 Scoala3'
  ]

export const Reviews = [
    {
      image: '../../assets/images/client.jpg',
      name: 'Laviniu Serban',
      comment: 'Multumesc ca mi ai salvat viata cu aplicatia ta minunata. Nu stiu ce as fi facut fara ea.'
    },
    {
      image: '../../assets/images/client.jpg',
      name: 'Caius',
      comment: 'Aplicatia ta este minunata. O sa o recomand tuturor prietenilor mei.'
    },
    {
      image: '../../assets/images/client.jpg',
      name: 'Nicoleta Popescu',
      comment: 'Cea mai buna aplicatie pe care am folosit-o vreodata. O sa o folosesc in continuare.'
    }
  ];

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
