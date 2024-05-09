import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgxTranslateModule } from "../translate/translate.module";

@Component({
  selector: 'app-survey-prediction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxTranslateModule
  ],
  templateUrl: './survey-prediction.component.html',
  styleUrl: './survey-prediction.component.css'
})
export class SurveyPredictionComponent {
  public surveyForm: any;
  public errorMessage: string = '';
  public prediction: string = '';
  public isFormSubmitted: boolean = false;
  private isAuthenticated: boolean = sessionStorage.getItem('isAuthenticated') === 'true';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.surveyForm = this.formBuilder.group({
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      smoking: ['', Validators.required],
      yellowFingers: ['', Validators.required],
      anxiety: ['', Validators.required],
      peerPressure: ['', Validators.required],
      chronicDisease: ['', Validators.required],
      fatigue: ['', Validators.required],
      allergy: ['', Validators.required],
      wheezing: ['', Validators.required],
      alcoholConsumption: ['', Validators.required],
      coughing: ['', Validators.required],
      shortnessOfBreath: ['', Validators.required],
      swallowingDifficulty: ['', Validators.required],
      chestPain: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.isFormSubmitted = true;

    if (this.surveyForm?.valid) {
      const formData = this.surveyForm.value;
      this.errorMessage = '';

      this.http.post<any>('http://127.0.0.1:3000/survey-predict', formData).subscribe({
        next: (response) => {
          this.prediction = this.getTranslation(response.prediction);
          this.insertPrediction(response.prediction);
        },
        error: (error) => { console.error('Error occurred while predicting the response:', error); }
      });
    } else {
      this.errorMessage = 'error.all-fields-required';
    }
  }

  private getTranslation(key: string): string {
    if (key === 'cancer') {
      return 'survey-prediction.cancer';
    } else if (key === 'no-cancer') {
      return 'survey-prediction.no-cancer';
    } else {
      return 'survey-prediction.unknown';
    }
  }

  private insertPrediction(prediction: string): void {
    if (this.isAuthenticated) {
      const userEmail = sessionStorage.getItem('user-email');
      if (userEmail !== null) {
        const insertData = this.surveyForm.value;
        insertData['user-email'] = userEmail;
        insertData['prediction'] = prediction;
        this.http.post<any>('http://127.0.0.1:3050/insert-survey-prediction', insertData).subscribe({
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
